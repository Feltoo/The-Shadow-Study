import React, { useEffect } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function StudyClock() {
    const { gameState, updateGameState, playSuccess, playError } = useGameState();
    const { clockTimeDisplay } = gameState.puzzleData;

    useEffect(() => {
        updateGameState({ clockInspected: true });
    }, [updateGameState]);

    return (
        <div className="detail-box">
            <p>The glass face is shattered. The mechanical hands are bent and permanently jammed at exactly:</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--danger-color)', fontSize: '38px', letterSpacing: '5px', marginTop: '20px', textAlign: 'center' }}>
                {clockTimeDisplay}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '15px', fontStyle: 'italic', textAlign: 'center' }}>
                A sticky note is attached to the frame: "The Shadow always reads things backwards."
            </p>
        </div>
    );
}
