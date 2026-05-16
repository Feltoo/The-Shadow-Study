import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function TunnelHatch() {
    const { gameState, addLog, gameOver, hasItem, playSuccess, playError } = useGameState();
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const { hatchWordDecoded, hatchWordEncoded, cipherShift } = gameState.puzzleData;

    const unlockHatch = () => {
        if (input.toUpperCase() === hatchWordDecoded) {
            addLog("The final padlock clicks open. The hatch releases. YOU DID IT.");
            gameOver(true);
        } else {
            playError();
            setError(true);
        }
    };

    return (
        <div className="detail-box">
            <p>A reinforced steel hatch at the bottom of the shaft. It is the final barrier between you and the surface.</p>

            {!gameState.grateUnlocked ? (
                <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>The hatch is inaccessible. It is buried beneath the heavy metal floor grate.</p>
            ) : (
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', marginTop: '15px', borderLeft: '4px solid var(--accent-color)' }}>
                    <p>The heavy padlock has a combination dial with an encoded word:</p>
                    
                    <div style={{ textAlign: 'center', margin: '15px 0' }}>
                        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: '28px', letterSpacing: '8px', color: 'var(--accent-color)' }}>
                            {hatchWordEncoded}
                        </p>
                        <p style={{ color: '#888', fontSize: '11px', fontStyle: 'italic', marginTop: '5px' }}>
                            (Encoded using The Shadow's personal cipher)
                        </p>
                    </div>

                    {hasItem('cipher_journal') && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '10px' }}>
                            Your journal says: shift each letter <strong>back</strong> by {cipherShift} position{cipherShift > 1 ? 's' : ''} to decode.
                        </p>
                    )}

                    <div className="input-group">
                        <input type="text" placeholder="DECODED WORD" maxLength="6" style={{ width: '140px', textAlign: 'center', textTransform: 'uppercase' }} value={input} onChange={e => setInput(e.target.value)} />
                        <button className="btn primary" onClick={unlockHatch}>Unlock</button>
                    </div>
                    {error && <p style={{ color: 'var(--danger-color)', marginTop: '5px' }}>Padlock jams. Wrong word.</p>}
                </div>
            )}
        </div>
    );
}
