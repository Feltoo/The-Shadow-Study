import React from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function TunnelGrate() {
    const { gameState, updateGameState, addLog, hasItem, playSuccess, playError } = useGameState();

    const openGrate = () => {
        playSuccess();
            updateGameState({ grateUnlocked: true });
        addLog("With a loud groan, the iron grate breaks free.");
    };

    return (
        <div className="detail-box">
            <p>A heavy cast-iron floor grate. It appears to cover a deep exit shaft.</p>

            {!gameState.transformerFixed ? (
                <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>You can't get close to the grate while the transformer is throwing lethal electrical arcs.</p>
            ) : !gameState.grateUnlocked ? (
                hasItem('crowbar') ? (
                    <>
                        <p style={{ marginTop: '15px' }}>The grate is rusted into the concrete. You'll need substantial leverage to pry it open.</p>
                        <button className="btn primary" onClick={openGrate} style={{ marginTop: '10px' }}>Use Crowbar</button>
                    </>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>The grate is stuck fast. You need a heavy tool to pry it up.</p>
                )
            ) : (
                <p style={{ color: 'var(--success-color)', marginTop: '15px' }}>The grate has been pried open, revealing the escape hatch above!</p>
            )}
        </div>
    );
}
