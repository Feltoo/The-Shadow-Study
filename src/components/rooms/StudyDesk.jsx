import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function StudyDesk() {
    const { gameState, updateGameState, addLog, addToInventory, removeFromInventory, hasItem, hasCollected, playSuccess, playError } = useGameState();
    const [pcInput, setPcInput] = useState('');
    const [pcError, setPcError] = useState(false);

    const { pcPasswordDecoded, labDoorCode, freqNumber, caseFile } = gameState.puzzleData;

    const unlockDrawer = () => {
        playSuccess();
            updateGameState({ drawerUnlocked: true });
        removeFromInventory('brass_key');
        addLog("You unlocked the drawer.");
    };

    const loginPC = () => {
        if (pcInput.toUpperCase() === pcPasswordDecoded) {
            playSuccess();
            updateGameState({ pcUnlocked: true });
            addLog("PC unlocked. You found the Lab Door code and an intercepted transmission.");
        } else {
            playError();
            setPcError(true);
        }
    };

    const usePunchCard = () => {
        playSuccess();
            updateGameState({ punchcardUsed: true });
        removeFromInventory('punch_card');
        addLog("The drive spins up, reading the Data Disk. A compartment clicks open.");
    };

    return (
        <div className="detail-box">
            <p>A heavy mahogany desk belonging to The Shadow. It contains a locked drawer and a sleek laptop.</p>
            <hr style={{ borderColor: '#333', margin: '15px 0' }} />

            {/* Top Drawer */}
            <h4 style={{ color: '#5a4b3c', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px dashed #99856f', paddingBottom: '5px' }}>Top Drawer</h4>
            {!gameState.drawerUnlocked ? (
                hasItem('brass_key') ? (
                    <>
                        <p>You have a brass key that fits the drawer.</p>
                        <button className="btn primary" onClick={unlockDrawer} style={{ marginTop: '10px' }}>Unlock Drawer</button>
                    </>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>The drawer is securely locked. It requires a physical key.</p>
                )
            ) : (
                <>
                    <p style={{ color: 'var(--success-color)' }}>The drawer is unlocked.</p>
                    
                    {/* Case File */}
                    <div style={{ padding: '15px', background: '#f4ecd8', color: '#111', margin: '15px 0', border: '1px solid #b5a893' }}>
                        <p style={{ fontWeight: 'bold', fontSize: '11px', letterSpacing: '2px', color: '#888', marginBottom: '8px' }}>CLASSIFIED — CASE FILE</p>
                        <p><strong>Case Name:</strong> The {caseFile.caseName}</p>
                        <p><strong>Year Closed:</strong> {caseFile.year}</p>
                        <p><strong>Lead Agent Codename:</strong> "{caseFile.codename}"</p>
                        <p style={{ color: '#c00', fontWeight: 'bold', marginTop: '5px', fontSize: '12px' }}>STATUS: TERMINATED</p>
                    </div>

                    {!hasCollected('cassette_tape') ? (
                        <button className="btn primary" onClick={() => addToInventory('cassette_tape', 'Microcassette')} style={{ marginTop: '10px' }}>Take Microcassette</button>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>The drawer is empty.</p>
                    )}
                </>
            )}

            <hr style={{ borderColor: '#333', margin: '20px 0' }} />

            {/* Laptop */}
            <h4 style={{ color: '#5a4b3c', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px dashed #99856f', paddingBottom: '5px' }}>Sleek Laptop</h4>
            {!gameState.pcUnlocked ? (
                !gameState.boardInspected ? (
                    <>
                        <p className="clue-text">LOGIN REQUIRED.</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '5px' }}>(You need to find a password on the Investigation Board first.)</p>
                    </>
                ) : (
                    <>
                        <p className="clue-text" style={{ color: '#5a4b3c' }}>ENTER CLEARANCE CODE:</p>
                        <div className="input-group">
                            <input type="text" placeholder="PASSWORD" maxLength="10" value={pcInput} onChange={e => setPcInput(e.target.value)} />
                            <button className="btn primary" onClick={loginPC}>Login</button>
                        </div>
                        {pcError && <p style={{ color: 'var(--danger-color)', marginTop: '5px' }}>Access Denied.</p>}
                    </>
                )
            ) : (
                <>
                    <p className="clue-text" style={{ color: 'var(--success-color)' }}>LOGIN SUCCESSFUL.</p>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', marginTop: '10px', borderLeft: '3px solid var(--accent-color)' }}>
                        <p style={{ color: '#0f0', fontFamily: 'monospace', margin: 0 }}>&gt;&gt; SHADOW DOSSIER ACCESSED.</p>
                        <p style={{ color: '#0f0', fontFamily: 'monospace', marginTop: '5px' }}>&gt;&gt; NOTE: The Secret Lab door code is {labDoorCode}.</p>
                        <p style={{ color: '#0f0', fontFamily: 'monospace', marginTop: '5px' }}>&gt;&gt; INTERCEPTED TRANSMISSION — Frequency: {freqNumber}</p>
                        <p style={{ color: '#0f0', fontFamily: 'monospace', marginTop: '5px' }}>&gt;&gt; (Archive mainframe requires dual-frequency authentication)</p>
                    </div>
                </>
            )}

            {/* Data Disk Drive */}
            {gameState.monitorsSolved && (
                <>
                    <hr style={{ borderColor: '#333', margin: '20px 0' }} />
                    <h4 style={{ color: '#5a4b3c', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px dashed #99856f', paddingBottom: '5px' }}>Magnetic Data Drive</h4>
                    {!gameState.punchcardUsed ? (
                        <>
                            <p>A hidden peripheral drive extends from the laptop.</p>
                            {hasItem('punch_card') ? (
                                <button className="btn primary" onClick={usePunchCard} style={{ marginTop: '10px' }}>Insert Data Disk</button>
                            ) : (
                                <p style={{ color: 'var(--text-secondary)' }}>It requires a specific Data Disk.</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p style={{ color: 'var(--success-color)' }}>Data Disk accepted.</p>
                            {!hasCollected('override_key') ? (
                                <>
                                    <p>A hidden compartment clicks open!</p>
                                    <button className="btn primary" onClick={() => addToInventory('override_key', 'Override Key')} style={{ marginTop: '10px' }}>Take Override Key</button>
                                </>
                            ) : (
                                <p style={{ color: 'var(--text-secondary)' }}>Compartment empty.</p>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
