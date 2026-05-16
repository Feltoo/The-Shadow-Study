import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function StudySafe() {
    const { gameState, updateGameState, addLog, addToInventory, hasItem, hasCollected, playSuccess, playError } = useGameState();
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const { caseFile } = gameState.puzzleData;

    const unlockSafe = () => {
        if (input === caseFile.year) {
            playSuccess();
            updateGameState({ safeUnlocked: true });
            addLog("Correct. The safe unlocks.");
        } else {
            playError();
            setError(true);
        }
    };

    return (
        <div className="detail-box">
            <p>A reinforced steel wall safe. It features an electronic keypad and a small LCD screen.</p>

            {!gameState.generatorFixed ? (
                <div style={{ background: 'rgba(200,0,0,0.05)', padding: '15px', marginTop: '15px', borderLeft: '4px solid #cc0000' }}>
                    <p style={{ color: '#cc0000', fontFamily: 'var(--font-typewriter)', fontWeight: 'bold' }}>[ERROR] POWER FAILURE. Keypad disabled.</p>
                    <p style={{ color: '#666', fontSize: '13px', marginTop: '5px' }}>(You'll need to restore facility power first.)</p>
                </div>
            ) : !gameState.safeUnlocked ? (
                <div style={{ background: 'rgba(0,0,0,0.03)', padding: '15px', marginTop: '15px', borderLeft: '4px solid #333' }}>
                    <p style={{ color: '#111', fontFamily: 'var(--font-typewriter)', fontWeight: 'bold' }}>[SYSTEM ONLINE] SECURITY QUESTION:</p>
                    <p style={{ marginTop: '10px' }}>"Enter the year of the {caseFile.caseName}."</p>
                    <div className="input-group" style={{ marginTop: '15px' }}>
                        <input type="text" placeholder="YYYY" maxLength="4" value={input} onChange={e => setInput(e.target.value)} />
                        <button className="btn primary" onClick={unlockSafe}>Enter</button>
                    </div>
                    {error && <p style={{ color: '#cc0000', marginTop: '10px', fontWeight: 'bold' }}>[ERROR] Incorrect Answer.</p>}
                </div>
            ) : (
                <>
                    <p style={{ color: 'var(--success-color)', marginTop: '15px' }}>The heavy door swings open.</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {!hasCollected('red_chemical') && (
                            <button className="btn primary" onClick={() => addToInventory('red_chemical', 'Red Chemical')}>Take Red Chemical</button>
                        )}
                        {!hasCollected('blueprint_fragment') && (
                            <button className="btn primary" onClick={() => {
                                addToInventory('blueprint_fragment', 'Blueprint Fragment');
                                addLog("A partial circuit schematic. Looks like it maps part of a ventilation system.");
                            }}>Take Blueprint Fragment</button>
                        )}
                    </div>
                    {hasItem('red_chemical') && hasItem('blueprint_fragment') && (
                        <p style={{ color: 'var(--text-secondary)' }}>The safe is empty.</p>
                    )}
                </>
            )}
        </div>
    );
}
