import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function LabGenerator() {
    const { gameState, updateGameState, addLog, hasItem, playSuccess, playError } = useGameState();
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const { generatorSequence, generatorAnswer, genFreq } = gameState.puzzleData;

    const fixGenerator = () => {
        if (input === generatorAnswer) {
            playSuccess();
            updateGameState({ generatorFixed: true });
            addLog(`Sequence accepted. Generator online. Output frequency: ${genFreq} Hz.`);
        } else {
            playError();
            setError(true);
        }
    };

    return (
        <div className="detail-box">
            <p>A massive, diesel-electric generator. It provides primary power to the lower levels.</p>

            {!gameState.generatorFixed ? (
                !hasItem('screwdriver') ? (
                    <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>The maintenance panel is tightly screwed shut. You cannot open it with your bare hands.</p>
                ) : (
                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', marginTop: '15px', border: '1px solid #333' }}>
                        <p>You opened the panel with the screwdriver. A digital diagnostic screen asks to balance the load sequence:</p>
                        <p style={{ fontFamily: 'monospace', fontSize: '20px', textAlign: 'center', margin: '15px 0' }}>
                            {generatorSequence.join(', ')}, <span style={{ color: 'var(--accent-color)' }}>?</span>
                        </p>
                        <div className="input-group" style={{ justifyContent: 'center' }}>
                            <input type="number" placeholder="###" style={{ width: '120px', textAlign: 'center' }} value={input} onChange={e => setInput(e.target.value)} />
                            <button className="btn primary" onClick={fixGenerator}>Submit</button>
                        </div>
                        {error && <p style={{ color: 'var(--danger-color)', marginTop: '5px', textAlign: 'center' }}>Sequence Error.</p>}
                    </div>
                )
            ) : (
                <>
                    <p style={{ color: 'var(--success-color)', marginTop: '15px', fontWeight: 'bold' }}>The generator is humming loudly. Full facility power restored!</p>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', marginTop: '10px', borderLeft: '3px solid var(--accent-color)', fontFamily: 'monospace' }}>
                        <p style={{ color: '#0f0', margin: 0 }}>GENERATOR ONLINE</p>
                        <p style={{ color: '#0f0', marginTop: '5px' }}>Output frequency: <strong>{genFreq}</strong> Hz</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '5px' }}>(Note this number — it may be needed later.)</p>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '10px' }}>(You hear electronic systems powering up in the previous room.)</p>
                </>
            )}
        </div>
    );
}
