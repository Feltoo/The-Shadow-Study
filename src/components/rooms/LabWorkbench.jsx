import React from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function LabWorkbench() {
    const { gameState, updateGameState, addLog, addToInventory, removeFromInventory, hasItem, playSuccess, playError } = useGameState();

    const playTape = () => {
        playSuccess();
            updateGameState({ tapePlayed: true });
        removeFromInventory('cassette_tape');
        addLog("Audio playing: '...the hazmat override is coded. Run the program on the emergency panel...'");
    };

    const takeBlueChemical = () => {
        playSuccess();
            updateGameState({ blueFound: true });
        addToInventory('blue_chemical', 'Blue Chemical');
    };

    const mixSolvent = () => {
        playSuccess();
            updateGameState({ solventMixed: true });
        removeFromInventory('blue_chemical');
        removeFromInventory('red_chemical');
        removeFromInventory('empty_beaker');
        addToInventory('purple_solvent', 'Purple Solvent');
        addLog("The chemicals react violently, settling into a highly corrosive Purple Solvent.");
    };

    return (
        <div className="detail-box">
            <p>A stainless steel workbench covered in chemistry equipment.</p>

            {/* Tape Player logic */}
            <div style={{ border: '1px solid #b5a893', padding: '15px', marginBottom: '20px', background: 'rgba(0,0,0,0.05)' }}>
                <h4 style={{ color: '#5a4b3c', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px dashed #99856f', paddingBottom: '5px' }}>Microcassette Recorder</h4>
                {!gameState.tapePlayed ? (
                    hasItem('cassette_tape') ? (
                        <>
                            <p>You have a Microcassette that fits the player.</p>
                            <button className="btn primary" onClick={playTape} style={{ marginTop: '10px' }}>Play Tape</button>
                        </>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>The recorder is empty. You need to find a tape.</p>
                    )
                ) : (
                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', borderLeft: '3px solid var(--accent-color)' }}>
                        <p style={{ color: '#0f0', fontFamily: 'monospace', margin: 0 }}>
                            AUDIO LOG: "The hazmat locker override... it's coded into a small program on the emergency panel. Run it in your head. The output, padded to four digits — that's the code."
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>
                            (Hint: You may need a specialized light to see what's on the locker panel.)
                        </p>
                    </div>
                )}
            </div>

            {/* Chemical Mixing logic */}
            <div style={{ border: '1px solid #b5a893', padding: '15px', background: 'rgba(0,0,0,0.05)' }}>
                <h4 style={{ color: '#5a4b3c', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px dashed #99856f', paddingBottom: '5px' }}>Chemical Mixing Area</h4>
                
                {!gameState.blueFound ? (
                    <>
                        <p>There is a vial of <strong>Blue Chemical</strong> resting on a rack.</p>
                        <button className="btn primary" onClick={takeBlueChemical} style={{ marginTop: '10px' }}>Take Blue Chemical</button>
                    </>
                ) : !gameState.solventMixed ? (
                    <>
                        <p>You need to mix a powerful corrosive solvent to melt the rusted Vault door.</p>
                        {(hasItem('blue_chemical') && hasItem('red_chemical') && hasItem('empty_beaker')) ? (
                            <button className="btn primary" onClick={mixSolvent} style={{ marginTop: '15px' }}>Mix Red & Blue Chemicals in Beaker</button>
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '10px' }}>
                                (Requires: Empty Beaker, Blue Chemical, and Red Chemical. The Red Chemical is securely locked in the Study's safe.)
                            </p>
                        )}
                    </>
                ) : (
                    <p style={{ color: 'var(--success-color)' }}>You have successfully synthesized the <strong>Purple Solvent</strong>.</p>
                )}
            </div>
        </div>
    );
}
