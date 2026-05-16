import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function StudyDoor({ onRoomChange, onClose }) {
    const { gameState, updateGameState, addLog, playSuccess, playError } = useGameState();
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const unlockDoor = () => {
        if (input === gameState.puzzleData.labDoorCode) {
            playSuccess();
            updateGameState({ labUnlocked: true });
            addLog("Door unseals... revealing a dark chemical laboratory!");
        } else {
            playError();
            setError(true);
        }
    };

    const enterLab = () => {
        onClose();
        onRoomChange('lab');
    };

    return (
        <div className="detail-box">
            <p>A reinforced steel door leading to the Chemical Lab.</p>

            {!gameState.pcUnlocked ? (
                <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>The keypad is active, but you don't know the code yet. Maybe it's on The Shadow's laptop.</p>
            ) : !gameState.labUnlocked ? (
                <>
                    <p style={{ marginTop: '15px' }}>Enter the override code found on the laptop:</p>
                    <div className="input-group">
                        <input type="password" placeholder="****" maxLength="4" value={input} onChange={e => setInput(e.target.value)} />
                        <button className="btn primary" onClick={unlockDoor}>Unlock</button>
                    </div>
                    {error && <p style={{ color: 'var(--danger-color)', marginTop: '5px' }}>Access Denied.</p>}
                </>
            ) : (
                <>
                    <p style={{ color: 'var(--success-color)', marginTop: '15px' }}>Door unlocked! The path to the Chemical Lab is clear.</p>
                    <button className="btn primary" onClick={enterLab} style={{ marginTop: '15px' }}>Enter Lab</button>
                </>
            )}
        </div>
    );
}
