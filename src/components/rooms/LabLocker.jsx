import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function LabLocker() {
    const { gameState, updateGameState, addLog, addToInventory, hasItem, hasCollected, playSuccess, playError } = useGameState();
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const { codeSnippet } = gameState.puzzleData;

    const unlockLocker = () => {
        if (input === codeSnippet.answer) {
            playSuccess();
            updateGameState({ lockerUnlocked: true });
            addLog("Locker unlocks.");
        } else {
            playError();
            setError(true);
        }
    };

    const uvActive = gameState.uvModeActive;

    return (
        <div className="detail-box">
            <p>A reinforced steel locker meant for hazardous materials. It has a digital keypad.</p>

            {/* UV-revealed code snippet on the emergency panel */}
            {hasItem('uv_flashlight') && (
                <div style={{ marginTop: '15px', padding: '15px', background: uvActive ? 'rgba(208,60,245,0.08)' : 'rgba(0,0,0,0.3)', border: `1px solid ${uvActive ? '#d03cf5' : '#333'}`, transition: 'all 0.3s', borderRadius: '4px' }}>
                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Emergency Override Panel:</p>
                    {uvActive ? (
                        <div style={{ background: '#0d1117', borderRadius: '6px', overflow: 'hidden', border: '1px solid #30363d' }}>
                            {/* Terminal header */}
                            <div style={{ background: '#161b22', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #30363d' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f85149' }}></div>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d29922' }}></div>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3fb950' }}></div>
                                <span style={{ color: '#8b949e', fontSize: '11px', marginLeft: '8px', fontFamily: 'monospace' }}>override.py</span>
                            </div>
                            {/* Code content */}
                            <pre style={{ 
                                color: '#c9d1d9', 
                                fontFamily: "'Courier Prime', 'Fira Code', monospace", 
                                fontSize: '14px', 
                                padding: '12px 16px', 
                                margin: 0, 
                                lineHeight: '1.6',
                                textShadow: '0 0 8px rgba(208,60,245,0.3)',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {codeSnippet.code.split('\n').map((line, i) => (
                                    <span key={i}>
                                        <span style={{ color: '#6e7681', marginRight: '12px', userSelect: 'none' }}>{i + 1}</span>
                                        {line.includes('print') ? (
                                            <><span style={{ color: '#d2a8ff' }}>print</span><span style={{ color: '#c9d1d9' }}>{line.replace('print', '')}</span></>
                                        ) : line.includes('for ') ? (
                                            <><span style={{ color: '#ff7b72' }}>for</span><span style={{ color: '#c9d1d9' }}>{line.replace('for', '')}</span></>
                                        ) : line.includes('if ') ? (
                                            <><span style={{ color: '#ff7b72' }}>if</span><span style={{ color: '#c9d1d9' }}>{line.replace('if', '')}</span></>
                                        ) : line.includes('else') ? (
                                            <span style={{ color: '#ff7b72' }}>{line}</span>
                                        ) : (
                                            <span style={{ color: '#c9d1d9' }}>{line}</span>
                                        )}
                                        {'\n'}
                                    </span>
                                ))}
                            </pre>
                            {/* Terminal output hint */}
                            <div style={{ borderTop: '1px solid #30363d', padding: '8px 16px', background: '#0d1117' }}>
                                <p style={{ color: '#3fb950', fontFamily: 'monospace', fontSize: '12px', margin: 0 }}>
                                    $ python override.py → <span style={{ color: '#d03cf5', textShadow: '0 0 10px #d03cf5' }}>???</span>
                                </p>
                                <p style={{ color: '#6e7681', fontSize: '11px', marginTop: '4px' }}>(Run this mentally. The output is the override code. Pad to 4 digits.)</p>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: '#555', fontStyle: 'italic' }}>The panel surface looks blank... but there may be hidden ink. Try toggling your UV light.</p>
                    )}
                </div>
            )}

            {!gameState.lockerUnlocked ? (
                !gameState.tapePlayed ? (
                    <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid #888', borderRadius: '4px' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>The keypad is active, but you have no idea what the 4-digit code is.</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '8px', fontStyle: 'italic' }}>💡 Try the <strong>Mixing Station</strong> first — there may be an audio log with a clue.</p>
                    </div>
                ) : (
                    <>
                        <p style={{ marginTop: '15px' }}>Enter the 4-digit hazmat override code:</p>
                        <div className="input-group">
                            <input type="text" placeholder="####" maxLength="4" value={input} onChange={e => setInput(e.target.value)} />
                            <button className="btn primary" onClick={unlockLocker}>Unlock</button>
                        </div>
                        {error && <p style={{ color: 'var(--danger-color)', marginTop: '5px' }}>Access Denied.</p>}
                    </>
                )
            ) : (
                <>
                    <p style={{ color: 'var(--success-color)', marginTop: '15px' }}>The locker is open.</p>
                    {(!hasCollected('screwdriver') || !hasCollected('empty_beaker')) ? (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {!hasCollected('screwdriver') && <button className="btn primary" onClick={() => addToInventory('screwdriver', 'Screwdriver')}>Take Screwdriver</button>}
                            {!hasCollected('empty_beaker') && <button className="btn primary" onClick={() => addToInventory('empty_beaker', 'Empty Beaker')}>Take Empty Beaker</button>}
                        </div>
                    ) : (
                        <p style={{ color: '#888', fontStyle: 'italic', marginTop: '10px' }}>It is empty now.</p>
                    )}
                </>
            )}
        </div>
    );
}
