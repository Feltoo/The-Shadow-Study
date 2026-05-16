import React from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function ArchiveFusebox() {
    const { gameState, updateGameState, addLog, removeFromInventory, hasItem, playSuccess, playError } = useGameState();

    const insertFuse = () => {
        playSuccess();
            updateGameState({ fuseInserted: true });
        removeFromInventory('fuse');
        addLog("Fuse inserted! The wall of surveillance monitors flickers to life.");
    };

    return (
        <div className="detail-box">
            <p>An exposed electrical panel feeding power to the surveillance monitors. One critical high-voltage fuse is missing.</p>

            {!gameState.fuseInserted ? (
                hasItem('fuse') ? (
                    <button className="btn primary" onClick={insertFuse} style={{ marginTop: '15px' }}>Insert Electrical Fuse</button>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>You need to find a replacement fuse to power up the Monitors.</p>
                )
            ) : (
                <div style={{ background: 'rgba(46,160,67,0.1)', padding: '15px', borderLeft: '4px solid var(--success-color)', marginTop: '15px' }}>
                    <p style={{ color: 'var(--success-color)' }}>Fuse installed. Monitors have power!</p>
                </div>
            )}
        </div>
    );
}
