import React, { useState, useEffect } from 'react';
import { useGameState } from './context/GameStateContext';
import RoomView from './components/RoomView';
import DetailView from './components/DetailView';
import { playClick, playSwitch } from './utils/audioEngine';

const itemMeta = {
    uv_flashlight: { icon: '🔦', color: '#8a2be2' },
    cipher_journal: { icon: '📓', color: '#5a4b3c' },
    brass_key: { icon: '🗝️', color: '#b8860b' },
    cassette_tape: { icon: '📼', color: '#333333' },
    red_chemical: { icon: '🧪', color: '#cc0000' },
    blueprint_fragment: { icon: '🗺️', color: '#0066cc' },
    fuse: { icon: '🔌', color: '#d2691e' },
    punch_card: { icon: '💽', color: '#555555' },
    screwdriver: { icon: '🪛', color: '#cc5500' },
    empty_beaker: { icon: '🫙', color: '#666666' },
    blue_chemical: { icon: '🧪', color: '#0000cd' },
    purple_solvent: { icon: '🧪', color: '#800080' },
    override_key: { icon: '🔑', color: '#b30000' },
    crowbar: { icon: '🔧', color: '#444444' }
};

function App() {
    const { gameState, startGame, updateGameState } = useGameState();
    const [detailTarget, setDetailTarget] = useState(null);

    const handleStartGame = () => {
        // Request fullscreen on game start
        const el = document.documentElement;
        if (el.requestFullscreen) {
            el.requestFullscreen().catch(() => {});
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
        startGame();
    };

    // Keyboard shortcut for UV Mode
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === 'U' || e.key === 'u') {
                updateGameState(prev => {
                    if (prev.inventory.some(i => i.id === 'uv_flashlight')) {
                        playSwitch();
                        return { uvModeActive: !prev.uvModeActive };
                    }
                    return {};
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [updateGameState]);

    // Global Click Sound for all Buttons
    useEffect(() => {
        const handleGlobalClick = (e) => {
            // Traverse up to see if a button was clicked (handles icons inside buttons)
            let target = e.target;
            while (target && target !== window.document) {
                if (target.tagName === 'BUTTON') {
                    playClick();
                    break;
                }
                target = target.parentNode;
            }
        };
        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, []);

    // Apply UV mode class to body like Vanilla JS
    useEffect(() => {
        if (gameState.uvModeActive) {
            document.body.classList.add('uv-mode-active');
        } else {
            document.body.classList.remove('uv-mode-active');
        }
    }, [gameState.uvModeActive]);

    // Auto-scroll investigation notes
    useEffect(() => {
        const logMessages = document.getElementById('log-messages');
        if (logMessages) {
            logMessages.scrollTop = logMessages.scrollHeight;
        }
    }, [gameState.logs]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleRoomChange = (room) => {
        updateGameState({ currentRoom: room });
        setDetailTarget(null);
    };

    const handleObjectClick = (target) => {
        if (!gameState.isGameOver) {
            setDetailTarget(target);
        }
    };

    return (
        <>
            <header className={gameState.gameStarted ? 'in-game-header' : 'menu-header hidden'}>
                {gameState.gameStarted && (
                    <>
                        <div className="desk-plate">THE SHADOW'S STUDY</div>
                        <div className="desk-timer" style={{ boxShadow: gameState.timeLeft <= 300 ? '0 0 15px rgba(255, 0, 0, 0.8)' : '' }}>
                            <div className="timer-label">TOXIN RELEASE</div>
                            <span id="timer">{formatTime(gameState.timeLeft)}</span>
                        </div>
                    </>
                )}
            </header>

            <main className={gameState.gameStarted ? 'desk-mode' : ''}>
                    <div id="game-container">
                        <div id="vignette" className={gameState.isGameOver && !gameState.hasWon ? 'danger-vignette' : ''}></div>
                        
                        {!detailTarget && gameState.gameStarted && (
                            <div id="room-nav">
                                <button className={`room-nav-btn ${gameState.currentRoom === 'study' ? 'active' : ''}`} onClick={() => handleRoomChange('study')}>📚 Study File</button>
                                <button className={`room-nav-btn ${gameState.labUnlocked ? '' : 'locked'} ${gameState.currentRoom === 'lab' ? 'active' : ''}`} onClick={() => gameState.labUnlocked && handleRoomChange('lab')}>🔬 Lab File</button>
                                <button className={`room-nav-btn ${gameState.vaultUnlocked ? '' : 'locked'} ${gameState.currentRoom === 'archive' ? 'active' : ''}`} onClick={() => gameState.vaultUnlocked && handleRoomChange('archive')}>📁 Archive File</button>
                                <button className={`room-nav-btn ${gameState.tunnelUnlocked ? '' : 'locked'} ${gameState.currentRoom === 'tunnel' ? 'active' : ''}`} onClick={() => gameState.tunnelUnlocked && handleRoomChange('tunnel')}>🚇 Tunnel File</button>
                            </div>
                        )}

                        <RoomView onObjectClick={handleObjectClick} />

                        {detailTarget && (
                            <DetailView target={detailTarget} onClose={() => setDetailTarget(null)} onRoomChange={handleRoomChange} />
                        )}
                    </div>

                    <aside id="sidebar">
                        <div className="clipboard-clip"></div>
                        <div className="panel" id="inventory-panel">
                            <h3 className="stamp-h3" style={{ fontSize: '18px' }}>ACQUIRED EVIDENCE</h3>
                            <ul id="inventory-list">
                                {gameState.inventory.length === 0 ? (
                                    <li className="empty-text">Empty</li>
                                ) : (
                                    gameState.inventory.map(item => {
                                        const meta = itemMeta[item.id] || { icon: '📦', color: '#111' };
                                        return (
                                            <li key={item.id} style={{ color: meta.color, borderBottom: `2px solid ${meta.color}55` }}>
                                                <span style={{ fontSize: '16px', marginRight: '6px' }}>{meta.icon}</span>
                                                {item.name}
                                                {item.id === 'uv_flashlight' && (
                                                    <span style={{ fontSize: '10px', color: '#888', marginLeft: '6px', fontWeight: 'normal' }}>(Press 'U')</span>
                                                )}
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>

                        <div className="panel" id="log-panel">
                            <h3 className="stamp-h3" style={{ fontSize: '18px' }}>INVESTIGATION NOTES</h3>
                            <div id="log-messages" className="typewriter-font">
                                {gameState.logs.map((log, i) => (
                                    <p key={i} className={i === gameState.logs.length - 1 ? "log-new" : ""}>{log}</p>
                                ))}
                            </div>
                        </div>
                    </aside>
                </main>

                {!gameState.gameStarted && (
                    <div id="main-menu" className="desk-bg">
                        <div className="case-folder">
                            <div className="folder-tab">CASE FILE: 8492-B</div>
                            <div className="folder-content">
                                <div className="stamp-title">TOP SECRET</div>
                                <h2 className="case-name">TARGET: THE SHADOW'S STUDY</h2>
                                
                                <div className="stapled-note">
                                    <div className="staple"></div>
                                    <p>
                                        <strong>ATTN: DETECTIVE VANCE</strong><br/><br/>
                                        You tracked the elusive "Shadow" to this hidden study, but the door just locked behind you. It's a trap.<br/><br/>
                                        A lethal toxin fills the room in exactly 20 minutes. Uncover his secrets and escape before it's too late.
                                    </p>
                                </div>
                                
                                <div className="polaroid-decor">
                                    <div className="photo"></div>
                                    <span className="polaroid-caption">Suspect Unknown</span>
                                </div>

                                <button className="open-file-btn" onClick={handleStartGame}>OPEN CASE FILE</button>
                            </div>
                        </div>
                    </div>
                )}

                {gameState.isGameOver && (
                    <div id="overlay" className="overlay" style={{ display: 'flex' }}>
                        <div className="overlay-content">
                            <h1 id="overlay-title" style={{ color: gameState.hasWon ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                {gameState.hasWon ? 'ESCAPE SUCCESSFUL' : 'Game Over'}
                            </h1>
                            <p id="overlay-message">
                                {gameState.hasWon 
                                    ? `You escaped The Shadow's trap with ${formatTime(gameState.timeLeft)} remaining!`
                                    : 'Time has run out. The lethal toxin has been released...'}
                            </p>
                            <button className="btn primary" onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
                                {gameState.hasWon ? 'PLAY AGAIN' : 'Restart'}
                            </button>
                        </div>
                    </div>
                )}
        </>
    );
}

export default App;
