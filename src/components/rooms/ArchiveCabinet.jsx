import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function ArchiveCabinet() {
    const { gameState, updateGameState, addLog, addToInventory, hasItem, hasCollected, playSuccess, playError } = useGameState();
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const { cabinetRiddle } = gameState.puzzleData;
    const uvActive = gameState.uvModeActive;

    const unlockCabinet = () => {
        if (input.toUpperCase() === cabinetRiddle.answer) {
            playSuccess();
            updateGameState({ cabinetUnlocked: true });
            addLog("The padlock snaps open.");
        } else {
            playError();
            setError(true);
        }
    };

    return (
        <div className="detail-box">
            <p>A wall of massive metal filing cabinets holding decades of The Shadow's blackmail. One secure drawer is locked with a word padlock.</p>

            {!gameState.cabinetUnlocked ? (
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', marginTop: '15px', border: '1px solid #333', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '10px', transition: 'all 0.3s' }}>
                        {hasItem('uv_flashlight') && uvActive 
                            ? cabinetRiddle.riddle 
                            : cabinetRiddle.maskedRiddle}
                    </p>
                    {hasItem('uv_flashlight') && !uvActive && (
                        <p style={{ color: '#888', fontSize: '11px', marginBottom: '10px' }}>
                            (The text is partially faded. Try your UV light to reveal the full riddle.)
                        </p>
                    )}
                    {!hasItem('uv_flashlight') && (
                        <p style={{ color: '#888', fontSize: '11px', marginBottom: '10px' }}>
                            (The riddle text is too faded to read. You need a specialized light.)
                        </p>
                    )}
                    <div className="input-group" style={{ justifyContent: 'center' }}>
                        <input type="text" placeholder="WORD" maxLength="6" style={{ width: '120px', textAlign: 'center', textTransform: 'uppercase' }} value={input} onChange={e => setInput(e.target.value)} />
                        <button className="btn primary" onClick={unlockCabinet}>Unlock</button>
                    </div>
                    {error && <p style={{ color: 'var(--danger-color)', marginTop: '5px' }}>Incorrect word.</p>}
                </div>
            ) : (
                <>
                    <p style={{ color: 'var(--success-color)', marginTop: '15px' }}>The panel is open.</p>
                    {!hasCollected('fuse') ? (
                        <button className="btn primary" onClick={() => addToInventory('fuse', 'Fuse')} style={{ marginTop: '10px' }}>Take Electrical Fuse</button>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>It is empty now.</p>
                    )}
                </>
            )}
        </div>
    );
}
