import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function TunnelTransformer() {
    const { gameState, updateGameState, addLog, playSuccess, playError } = useGameState();
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const { caseFile } = gameState.puzzleData;

    const fixTransformer = () => {
        if (input.toUpperCase() === caseFile.codename) {
            playSuccess();
            updateGameState({ transformerFixed: true });
            addLog("The violent electrical sparking ceases.");
        } else {
            playError();
            setError(true);
        }
    };

    return (
        <div className="detail-box">
            <p>A massive electrical transformer blocking the corridor. It is sparking violently across a puddle of water, preventing you from reaching the grate safely.</p>

            {!gameState.fanStopped ? (
                 <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>The spinning fan makes it impossible to approach the transformer right now.</p>
            ) : !gameState.transformerFixed ? (
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', marginTop: '15px', borderLeft: '4px solid var(--accent-color)' }}>
                    <p>The diagnostic screen demands a security override to discharge the coils:</p>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', margin: '10px 0', borderLeft: '3px solid #0f0', fontFamily: 'monospace' }}>
                        <p style={{ color: '#0f0', margin: 0 }}>&gt; SECURITY OVERRIDE REQUIRED</p>
                        <p style={{ color: '#0f0', marginTop: '5px' }}>&gt; ENTER LEAD AGENT CODENAME</p>
                        <p style={{ color: '#0f0', marginTop: '5px' }}>&gt; FROM: Case File — The {caseFile.caseName}</p>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontStyle: 'italic', marginBottom: '10px' }}>
                        (You saw this in the case file from the Study desk drawer.)
                    </p>
                    <div className="input-group">
                        <input type="text" placeholder="CODENAME" maxLength="10" style={{ textTransform: 'uppercase' }} value={input} onChange={e => setInput(e.target.value)} />
                        <button className="btn primary" onClick={fixTransformer}>Discharge</button>
                    </div>
                    {error && <p style={{ color: 'var(--danger-color)', marginTop: '5px' }}>Incorrect. Codename not recognized.</p>}
                </div>
            ) : (
                <div style={{ background: 'rgba(46,160,67,0.1)', padding: '15px', borderLeft: '4px solid var(--success-color)', marginTop: '15px' }}>
                    <p style={{ color: 'var(--success-color)' }}>The transformer coils are discharged. It is safe to pass.</p>
                </div>
            )}
        </div>
    );
}
