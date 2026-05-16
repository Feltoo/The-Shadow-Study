import React from 'react';
import { useGameState } from '../context/GameStateContext';

const RoomView = ({ onObjectClick }) => {
    const { gameState } = useGameState();

    return (
        <>
            {gameState.currentRoom === 'study' && (
                <div id="room-study" className="room-layer active">
                    <div id="obj-clock" className="interactable" onClick={() => onObjectClick('clock')} title="Broken Clock"></div>
                    <div id="obj-bookshelf" className="interactable" onClick={() => onObjectClick('bookshelf')} title="Bookshelf"></div>
                    <div id="obj-board" className="interactable" onClick={() => onObjectClick('board')} title="Investigation Board"></div>
                    <div id="obj-desk" className="interactable" onClick={() => onObjectClick('desk')} title="Heavy Wooden Desk"></div>
                    <div id="obj-safe" className="interactable" onClick={() => onObjectClick('safe')} title="Heavy Safe"></div>
                    <div id="obj-door" className="interactable" onClick={() => onObjectClick('door')} title="Exit Door"></div>
                </div>
            )}

            {gameState.currentRoom === 'lab' && (
                <div id="room-lab" className="room-layer active">
                    <div id="obj-workbench" className="interactable" onClick={() => onObjectClick('workbench')} title="Mixing Station"></div>
                    <div id="obj-locker" className="interactable" onClick={() => onObjectClick('locker')} title="Hazmat Locker"></div>
                    <div id="obj-generator" className="interactable" onClick={() => onObjectClick('generator')} title="Rusty Generator"></div>
                    <div id="obj-vault" className="interactable" onClick={() => onObjectClick('vault')} title="Vault Door"></div>
                </div>
            )}

            {gameState.currentRoom === 'archive' && (
                <div id="room-archive" className="room-layer active">
                    <div id="obj-cabinet" className="interactable" onClick={() => onObjectClick('cabinet')} title="Filing Cabinet"></div>
                    <div id="obj-fusebox" className="interactable" onClick={() => onObjectClick('fusebox')} title="Fuse Box"></div>
                    <div id="obj-monitors" className="interactable" onClick={() => onObjectClick('monitors')} title="Surveillance Monitors"></div>
                    <div id="obj-blastdoor" className="interactable" onClick={() => onObjectClick('blastdoor')} title="Blast Door"></div>
                </div>
            )}

            {gameState.currentRoom === 'tunnel' && (
                <div id="room-tunnel" className="room-layer active">
                    <div id="obj-fancontrol" className="interactable" onClick={() => onObjectClick('fancontrol')} title="Fan Control"></div>
                    <div id="obj-transformer" className="interactable" onClick={() => onObjectClick('transformer')} title="Transformer"></div>
                    <div id="obj-grate" className="interactable" onClick={() => onObjectClick('grate')} title="Metal Grate"></div>
                    <div id="obj-hatch" className="interactable" onClick={() => onObjectClick('hatch')} title="Escape Hatch"></div>
                </div>
            )}
        </>
    );
};

export default RoomView;
