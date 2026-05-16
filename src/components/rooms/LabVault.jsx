import React from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function LabVault({ onRoomChange, onClose }) {
    const { gameState, updateGameState, addLog, removeFromInventory, hasItem, playSuccess, playError } = useGameState();

    const unlockVault = () => {
        playSuccess();
            updateGameState({ vaultUnlocked: true });
        removeFromInventory('purple_solvent');
        addLog("The solvent hisses violently, eating through the rust in seconds. The vault unlocks.");
    };

    const enterServer = () => {
        onClose();
        onRoomChange('archive');
    };

    return (
        <div className="detail-box">
            <p>A thick steel vault door leading deeper into the bunker. The mechanical locks are heavily rusted and completely fused together.</p>

            {!gameState.vaultUnlocked ? (
                hasItem('purple_solvent') ? (
                    <>
                        <p style={{ marginTop: '15px' }}>You have the Purple Solvent. It looks corrosive enough to melt the rusted lock.</p>
                        <button className="btn primary" onClick={unlockVault} style={{ marginTop: '10px' }}>Pour Solvent on Lock</button>
                    </>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>No amount of force will open this. You need a powerful chemical solvent to melt through the rust.</p>
                )
            ) : (
                <>
                    <p style={{ color: 'var(--success-color)', marginTop: '15px' }}>The rust melts away instantly. The vault door is open!</p>
                    <button className="btn primary" onClick={enterServer} style={{ marginTop: '15px' }}>Enter Server Room</button>
                </>
            )}
        </div>
    );
}
