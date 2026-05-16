import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function ArchiveMonitors() {
    const { gameState, updateGameState, addLog, addToInventory, hasItem, hasCollected, playSuccess, playError } = useGameState();
    const [freq1Input, setFreq1Input] = useState('');
    const [freq2Input, setFreq2Input] = useState('');
    const [freqError, setFreqError] = useState(false);
    const [codeInput, setCodeInput] = useState('');
    const [codeError, setCodeError] = useState(false);

    const { freqNumber, genFreq, monitorTests, monitorAnswer } = gameState.puzzleData;

    const authFrequencies = () => {
        if (freq1Input === freqNumber && freq2Input === genFreq) {
            playSuccess();
            updateGameState({ monitorFreqAuthed: true });
            addLog("Dual-frequency authentication accepted. Logic test loading...");
        } else {
            playError();
            setFreqError(true);
        }
    };

    const solveMonitors = () => {
        if (codeInput === monitorAnswer) {
            playSuccess();
            updateGameState({ monitorsSolved: true });
            addLog("Mainframe logic accepted! It hums and dispenses a card.");
        } else {
            playError();
            setCodeError(true);
        }
    };

    return (
        <div className="detail-box">
            {!gameState.fuseInserted ? (
                <p>The bank of green-tinted CRT monitors is dead and dark. It has no power.</p>
            ) : !gameState.monitorFreqAuthed ? (
                <>
                    <p>The monitors flicker to life. The mainframe demands dual-frequency authentication:</p>
                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', marginTop: '15px', border: '1px solid var(--border-color)', fontFamily: "'Courier Prime', monospace" }}>
                        <p style={{ color: '#0f0', margin: 0 }}>&gt; MAINFRAME BOOT SEQUENCE...</p>
                        <p style={{ color: '#0f0', marginTop: '5px' }}>&gt; DUAL-FREQUENCY AUTHENTICATION REQUIRED</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '10px', fontStyle: 'italic' }}>
                            (Frequency 1 was on The Shadow's laptop. Frequency 2 was on the Generator readout.)
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <label style={{ color: '#0f0', fontSize: '13px' }}>Freq 1:</label>
                            <input type="text" placeholder="##" maxLength="2" style={{ width: '60px', textAlign: 'center' }} value={freq1Input} onChange={e => setFreq1Input(e.target.value)} />
                            <label style={{ color: '#0f0', fontSize: '13px' }}>Freq 2:</label>
                            <input type="text" placeholder="##" maxLength="2" style={{ width: '60px', textAlign: 'center' }} value={freq2Input} onChange={e => setFreq2Input(e.target.value)} />
                            <button className="btn primary" onClick={authFrequencies}>Authenticate</button>
                        </div>
                        {freqError && <p style={{ color: 'var(--danger-color)', marginTop: '5px' }}>Frequency mismatch. Access denied.</p>}
                    </div>
                </>
            ) : !gameState.monitorsSolved ? (
                <>
                    <p>Authentication passed. The center screen glows ominously with a logic test:</p>
                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', margin: '15px 0', border: '1px solid var(--border-color)', fontFamily: "'Courier Prime', monospace" }}>
                        {monitorTests.map((test, i) => (
                            <p key={i} style={{ color: '#0f0', margin: i === 0 ? 0 : '5px 0 0 0' }}>
                                &gt; TEST {i + 1}: {test.question}
                            </p>
                        ))}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>(Combine the answers in order to form the code).</p>
                    <div className="input-group" style={{ marginTop: '15px' }}>
                        <input type="text" placeholder="CODE" maxLength="8" style={{ width: '120px', textAlign: 'center' }} value={codeInput} onChange={e => setCodeInput(e.target.value)} />
                        <button className="btn primary" onClick={solveMonitors}>Submit</button>
                    </div>
                    {codeError && <p style={{ color: 'var(--danger-color)', marginTop: '5px' }}>Logic sequence invalid.</p>}
                </>
            ) : (
                <>
                    <div style={{ background: 'rgba(46,160,67,0.1)', padding: '15px', borderLeft: '4px solid var(--success-color)', marginTop: '15px' }}>
                        <p style={{ color: 'var(--success-color)', fontFamily: 'monospace' }}>&gt; OVERRIDE ACCEPTED.</p>
                        <p style={{ color: 'var(--success-color)', fontFamily: 'monospace' }}>&gt; DISPENSING MAGNETIC DATA DISK...</p>
                    </div>
                    {!hasCollected('punch_card') && !gameState.punchcardUsed ? (
                        <button className="btn primary" onClick={() => addToInventory('punch_card', 'Punch Card')} style={{ marginTop: '15px' }}>Take Data Disk</button>
                    ) : gameState.punchcardUsed && (
                        <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>You already used the Data Disk on The Shadow's laptop.</p>
                    )}
                </>
            )}
        </div>
    );
}
