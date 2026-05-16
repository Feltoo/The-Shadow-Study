import React, { useEffect } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function StudyBoard() {
    const { gameState, updateGameState, hasItem, playSuccess, playError } = useGameState();
    const { pcPasswordEncoded, cipherShift } = gameState.puzzleData;

    useEffect(() => {
        if (hasItem('uv_flashlight')) {
            updateGameState({ boardInspected: true });
        }
    }, [hasItem, updateGameState]);

    // Format the encoded word with spaced letters
    const spacedEncoded = pcPasswordEncoded.split('').join(' ');

    return (
        <div className="detail-box">
            <p>A large cork board covered in suspect photos, crime scenes, and red string. It looks ordinary to the naked eye.</p>
            
            {!hasItem('uv_flashlight') ? (
                <p style={{ color: 'var(--text-secondary)', marginTop: '15px', fontStyle: 'italic' }}>
                    You investigate closely, but nothing stands out. You might need a specialized light to reveal hidden ink.
                </p>
            ) : (
                <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.5)', padding: '20px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <p className="uv-reveal" style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '10px', fontStyle: 'italic' }}>
                        (Scrawled in UV ink: "Encoded per my personal cipher. —S")
                    </p>
                    <p className="clue-text uv-reveal" style={{ fontSize: '28px', letterSpacing: '8px', fontFamily: "'Courier Prime', monospace" }}>
                        {spacedEncoded}
                    </p>
                    {hasItem('cipher_journal') ? (
                        <p className="uv-reveal" style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '12px' }}>
                            (Your journal says: shift each letter back by {cipherShift} position{cipherShift > 1 ? 's' : ''} to decode.)
                        </p>
                    ) : (
                        <p className="uv-reveal" style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '12px' }}>
                            (The text appears encoded. You need a cipher key to decode it.)
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
