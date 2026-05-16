import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { generatePuzzles } from '../utils/puzzleGenerator';
import { playTypewriter, playSuccess, playError, startAmbientHum, stopAmbientHum, playVictory, playGameOver } from '../utils/audioEngine';

const GameStateContext = createContext();

const defaultState = {
    // Core Game State
    gameStarted: false,
    isGameOver: false,
    hasWon: false,
    timeLeft: 20 * 60,
    inventory: [],
    collectedItems: [], // Track historically collected items
    currentRoom: 'study',
    logs: ["You are trapped. The Shadow has initiated the toxin release sequence."],
    uvModeActive: false,
    
    // Puzzle Flags
    clockInspected: false,
    bookshelfUnlocked: false,
    drawerUnlocked: false,
    boardInspected: false,
    pcUnlocked: false,
    labUnlocked: false,

    tapePlayed: false,
    lockerUnlocked: false,
    generatorFixed: false,
    vaultUnlocked: false,

    safeUnlocked: false,
    blueFound: false,
    solventMixed: false,

    archiveUnlocked: false,
    cabinetUnlocked: false,
    fuseInserted: false,
    monitorsSolved: false,
    monitorFreqAuthed: false,
    punchcardUsed: false,
    tunnelUnlocked: false,

    fanStopped: false,
    transformerFixed: false,
    grateUnlocked: false,
    hatchUnlocked: false,

    puzzleData: generatePuzzles()
};

export const GameStateProvider = ({ children }) => {
    const [gameState, setGameState] = useState(defaultState);

    const updateGameState = useCallback((updates) => {
        setGameState(prev => {
            const resolvedUpdates = typeof updates === 'function' ? updates(prev) : updates;
            return { ...prev, ...resolvedUpdates };
        });
    }, []);

    const addLog = useCallback((message) => {
        playTypewriter();
        setGameState(prev => ({
            ...prev,
            logs: [...prev.logs, message]
        }));
    }, []);

    const addToInventory = useCallback((id, name) => {
        playSuccess();
        setGameState(prev => {
            if (prev.inventory.find(i => i.id === id)) return prev;
            return {
                ...prev,
                inventory: [...prev.inventory, { id, name }],
                collectedItems: prev.collectedItems.includes(id) ? prev.collectedItems : [...prev.collectedItems, id],
                logs: [...prev.logs, `Picked up: ${name}`]
            };
        });
    }, []);

    const removeFromInventory = useCallback((id) => {
        setGameState(prev => ({
            ...prev,
            inventory: prev.inventory.filter(i => i.id !== id)
        }));
    }, []);

    const hasItem = useCallback((id) => {
        return gameState.inventory.some(i => i.id === id);
    }, [gameState.inventory]);

    const hasCollected = useCallback((id) => {
        return gameState.collectedItems.includes(id);
    }, [gameState.collectedItems]);

    const startGame = useCallback(() => {
        startAmbientHum();
        setGameState({
            ...defaultState,
            gameStarted: true,
            puzzleData: generatePuzzles()
        });
    }, []);

    const gameOver = useCallback((won) => {
        stopAmbientHum();
        if (won) playVictory();
        else playGameOver();
        
        setGameState(prev => ({ ...prev, isGameOver: true, hasWon: won }));
    }, []);

    // Timer logic
    useEffect(() => {
        let timer;
        if (gameState.gameStarted && !gameState.isGameOver && gameState.timeLeft > 0) {
            timer = setInterval(() => {
                setGameState(prev => {
                    const newTime = prev.timeLeft - 1;
                    if (newTime <= 0) {
                        clearInterval(timer);
                        stopAmbientHum();
                        playGameOver();
                        return { ...prev, timeLeft: 0, isGameOver: true, hasWon: false };
                    }
                    return { ...prev, timeLeft: newTime };
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState.gameStarted, gameState.isGameOver, gameState.timeLeft]);

    return (
        <GameStateContext.Provider value={{ 
            gameState, 
            updateGameState, 
            addLog, 
            addToInventory, 
            removeFromInventory, 
            hasItem, 
            hasCollected,
            startGame,
            gameOver,
            playSuccess,
            playError
        }}>
            {children}
        </GameStateContext.Provider>
    );
};

export const useGameState = () => useContext(GameStateContext);
