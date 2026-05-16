import React from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function ArchiveBlastdoor({ onRoomChange, onClose }) {
    const { gameState, updateGameState, addLog, removeFromInventory, hasItem, playSuccess, playError } = useGameState();

    const insertKey = () => {
        playSuccess();
            updateGameState({ tunnelUnlocked: true });
        removeFromInventory('override_key');
        addLog("You insert the Override Key. The heavy blast doors grind open.");
    };

    const enterTunnel = () => {
        onClose();
        onRoomChange('tunnel');
    };

    return (
        <div className="detail-box">
            <p>A massive, hydraulically-sealed industrial blast door leading to the ventilation shafts.</p>

            {!gameState.tunnelUnlocked ? (
                <>
                    <div style={{ background: 'rgba(248,81,73,0.1)', padding: '15px', borderLeft: '4px solid var(--danger-color)', marginTop: '15px' }}>
                        <p>The lock displays: "PHYSICAL OVERRIDE KEY REQUIRED".</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '5px' }}>(You need an Override Key, maybe hidden in a previous room?)</p>
                    </div>
                    {hasItem('override_key') && (
                        <button className="btn primary" onClick={insertKey} style={{ marginTop: '15px' }}>Insert Override Key</button>
                    )}
                </>
            ) : (
                <>
                    <p style={{ color: 'var(--success-color)', marginTop: '15px' }}>The blast door is unlocked!</p>
                    <button className="btn primary" onClick={enterTunnel} style={{ marginTop: '15px' }}>Enter the Vent Shaft</button>
                </>
            )}
        </div>
    );
}
