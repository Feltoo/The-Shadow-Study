import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function StudyBookshelf() {
    const { gameState, updateGameState, addLog, addToInventory, hasCollected, playSuccess, playError } = useGameState();
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const handleUnlock = () => {
        if (input === gameState.puzzleData.clockCode) {
            if (!gameState.clockInspected) {
                addLog("You guessed the code... but how? (You should inspect the clock!)");
            }
            playSuccess();
            updateGameState({ bookshelfUnlocked: true });
            addLog("The lockbox clicks open.");
        } else {
            playError();
            setError(true);
        }
    };

    const takeUV = () => {
        addToInventory('uv_flashlight', 'UV Flashlight');
        addLog("A heavy duty blacklight. Could reveal hidden messages.");
    };

    const takeCipherKey = () => {
        addToInventory('cipher_journal', "Shadow's Cipher Key");
        addLog("A torn page detailing a transposition cipher...");
    };

    return (
        <div className="detail-box">
            <p>A dusty shelf filled with intelligence dossiers and manuals. Nestled among them is a small lockbox.</p>
            
            {!gameState.bookshelfUnlocked ? (
                <div style={{ background: 'rgba(0,0,0,0.03)', padding: '15px', marginTop: '15px', borderLeft: '4px solid #333' }}>
                    <p style={{ color: '#111', fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>"Time is the key."</p>
                    <div className="input-group">
                        <input type="text" placeholder="####" maxLength="4" style={{ width: '100px', textAlign: 'center' }} value={input} onChange={e => setInput(e.target.value)} />
                        <button className="btn primary" onClick={handleUnlock}>Unlock</button>
                    </div>
                    {error && <p style={{ color: '#cc0000', marginTop: '10px', fontWeight: 'bold' }}>[ERROR] Incorrect code.</p>}
                </div>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    <h3 className="stamp-h3">Open Lockbox</h3>
                    {(!hasCollected('uv_flashlight') || !hasCollected('brass_key') || !hasCollected('cipher_journal')) ? (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {!hasCollected('uv_flashlight') && <button className="btn primary" onClick={takeUV}>Take UV Flashlight</button>}
                            {!hasCollected('brass_key') && <button className="btn primary" onClick={() => addToInventory('brass_key', 'Brass Key')}>Take Brass Key</button>}
                            {!hasCollected('cipher_journal') && <button className="btn primary" onClick={takeCipherKey}>Take Torn Journal Page</button>}
                        </div>
                    ) : (
                        <p style={{ color: '#888', fontStyle: 'italic', marginTop: '10px' }}>The lockbox is empty.</p>
                    )}
                </div>
            )}
        </div>
    );
}
