import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function TunnelFancontrol() {
    const { gameState, updateGameState, addLog, addToInventory, hasItem, hasCollected, playSuccess, playError } = useGameState();
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const { circuit } = gameState.puzzleData;
    const uvActive = gameState.uvModeActive;
    const hasBlueprint = hasItem('blueprint_fragment');

    const stopFan = () => {
        if (input.toUpperCase() === circuit.answer) {
            playSuccess();
            updateGameState({ fanStopped: true });
            addLog("The giant fan blades slowly grind to a halt.");
        } else {
            playError();
            setError(true);
        }
    };

    // Determine which diagram version to show
    const getDiagram = () => {
        if (hasBlueprint && uvActive) return circuit.fullDiagram;
        if (hasBlueprint) return circuit.blueprintDiagram;
        if (uvActive) return circuit.uvDiagram;
        return circuit.maskedDiagram;
    };

    const getHintText = () => {
        if (hasBlueprint && uvActive) return "(Full circuit revealed: Blueprint + UV light combined!)";
        if (hasBlueprint) return "(Blueprint shows node letters, but endpoints are unclear. Try UV light to reveal STOP/OVERLOAD markers.)";
        if (uvActive) return "(UV reveals path endpoints, but node labels are hidden. You need a blueprint or schematic.)";
        return "(The panel labels are unreadable. You need a schematic and a way to reveal hidden markings.)";
    };

    return (
        <div className="detail-box">
            <p>A control terminal for the giant industrial ventilation fan blocking your path.</p>

            {!gameState.fanStopped ? (
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', marginTop: '15px', border: '1px solid #333' }}>
                    <p>To safely shut down the fan, trace the correct override circuit path:</p>
                    <pre style={{ 
                        color: (hasBlueprint && uvActive) ? 'var(--accent-color)' : '#888', 
                        fontFamily: 'monospace', 
                        margin: '15px 0', 
                        background: '#111', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        fontSize: '13px', 
                        textAlign: 'left',
                        transition: 'color 0.3s',
                        lineHeight: '1.4'
                    }}>
{getDiagram().join('\n')}
                    </pre>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', fontStyle: 'italic', marginBottom: '10px' }}>
                        {getHintText()}
                    </p>
                    <div className="input-group">
                        <input type="text" placeholder="Trace path (e.g. ABC)" maxLength="5" style={{ textTransform: 'uppercase' }} value={input} onChange={e => setInput(e.target.value)} />
                        <button className="btn primary" onClick={stopFan}>Submit Path</button>
                    </div>
                    {error && <p style={{ color: 'var(--danger-color)', marginTop: '5px' }}>Circuit overloaded. Try again.</p>}
                </div>
            ) : (
                <>
                    <div style={{ background: 'rgba(46,160,67,0.1)', padding: '15px', borderLeft: '4px solid var(--success-color)', marginTop: '15px' }}>
                        <p style={{ color: 'var(--success-color)' }}>Fan successfully powered down!</p>
                    </div>
                    
                    {!hasCollected('crowbar') ? (
                        <>
                            <p style={{ marginTop: '15px' }}>With the fan blades stopped, you spot a heavy steel crowbar tangled in the mechanism.</p>
                            <button className="btn primary" onClick={() => addToInventory('crowbar', 'Crowbar')} style={{ marginTop: '10px' }}>Take Crowbar</button>
                        </>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>The fan is dead still.</p>
                    )}
                </>
            )}
        </div>
    );
}
