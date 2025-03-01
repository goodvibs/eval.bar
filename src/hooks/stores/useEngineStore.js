import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'cm-chess';
import { useGameStore } from './useGameStore';

// Constants for engine settings
const ENGINE_CONSTANTS = {
    MIN_MULTIPV: 1,
    MAX_MULTIPV: 5,
    DEFAULT_MULTIPV: 3,
    MIN_SEARCH_DEPTH: 10,
    MAX_SEARCH_DEPTH: 30,
    DEFAULT_SEARCH_DEPTH: 20,
    STORAGE_KEY: 'engine-settings'
};

// Helper functions for processing engine output
const parsePV = (message, currentFen) => {
    const pvIndex = message.indexOf(' pv ') + 4;
    if (pvIndex <= 4) return []; // No PV found

    const movesStr = message.slice(pvIndex).split(' ');

    // Create a new chess instance from current position and validate moves
    const validMoves = [];
    const validateChess = new Chess(currentFen);

    for (const moveUCI of movesStr) {
        try {
            if (moveUCI.length < 4) continue; // Skip invalid moves

            const from = moveUCI.slice(0, 2);
            const to = moveUCI.slice(2, 4);
            const promotion = moveUCI.length > 4 ? moveUCI[4] : undefined;

            const move = validateChess.move({
                from,
                to,
                promotion: promotion?.toLowerCase()
            });

            if (move) {
                validMoves.push(move.san);
            } else {
                break; // Stop at first invalid move
            }
        } catch (e) {
            break;
        }
    }

    return validMoves;
};

const parseScore = (message, isBlackToMove) => {
    const mateMatch = message.match(/score mate (-?\d+)/);
    const cpMatch = message.match(/score cp (-?\d+)/);

    if (mateMatch) {
        const mateIn = parseInt(mateMatch[1]);
        let score = mateIn > 0 ? `M${mateIn}` : `-M${Math.abs(mateIn)}`;

        if (isBlackToMove && typeof score === 'string') {
            score = score.startsWith('M') ? `-M${score.slice(1)}` : `M${score.slice(2)}`;
        }

        return score;
    }

    if (cpMatch) {
        const score = parseInt(cpMatch[1]) / 100;
        return isBlackToMove ? -score : score;
    }

    return 0;
};

// Main store definition with persistence for settings
export const useEngineStore = create(
    persist(
        (set, get) => ({
            // Analysis state
            isAnalyzing: false,
            engineReady: false,
            depth: 0,
            multipv: ENGINE_CONSTANTS.DEFAULT_MULTIPV,
            searchDepth: ENGINE_CONSTANTS.DEFAULT_SEARCH_DEPTH,
            currentLines: [],
            engineThinking: '',
            analysisHistory: {}, // Stores analysis keyed by FEN

            // Reference to hold engine functions (set from outside)
            engineInterface: null,

            // Set the engine interface (called from EngineProvider)
            setEngineInterface: (engine) => {
                // Only update if engine is valid and different
                if (engine && engine !== get().engineInterface) {
                    set({ engineInterface: engine });

                    // Configure engine with current settings
                    engine.configure({
                        MultiPV: get().multipv
                    });
                }
            },

            // Set engine ready status
            setEngineReady: (ready) => set({ engineReady: ready }),

            // Settings management
            setMultiPV: (value) => {
                const newValue = parseInt(value);
                if (isNaN(newValue) || newValue < ENGINE_CONSTANTS.MIN_MULTIPV || newValue > ENGINE_CONSTANTS.MAX_MULTIPV) return;

                set({ multipv: newValue });

                // Update engine setting if available
                const { engineInterface, isAnalyzing } = get();
                if (engineInterface) {
                    engineInterface.sendCommand('stop');
                    engineInterface.configure({ MultiPV: newValue });

                    // Restart analysis if active
                    if (isAnalyzing) {
                        get().continueAnalysis();
                    }
                }
            },

            setSearchDepth: (value) => {
                const newDepth = parseInt(value);
                if (isNaN(newDepth) || newDepth < ENGINE_CONSTANTS.MIN_SEARCH_DEPTH || newDepth > ENGINE_CONSTANTS.MAX_SEARCH_DEPTH) return;

                set({ searchDepth: newDepth });

                // Restart analysis with new depth if analyzing
                if (get().isAnalyzing) {
                    get().continueAnalysis();
                }
            },

            // Analysis control functions
            startAnalysis: () => {
                const { multipv, searchDepth, engineReady, engineInterface } = get();

                if (!engineReady || !engineInterface) {
                    console.error("Engine not ready");
                    return false;
                }

                console.log(`Starting analysis with MultiPV: ${multipv}, depth: ${searchDepth}`);
                set({ isAnalyzing: true, currentLines: [] });

                // Configure and start analysis
                engineInterface.configure({ MultiPV: multipv });
                engineInterface.sendCommand('position fen ' + useGameStore.getState().currentPositionFen);
                engineInterface.sendCommand(`go depth ${searchDepth}`);
                return true;
            },

            stopAnalysis: () => {
                const { engineInterface } = get();
                set({ isAnalyzing: false });

                if (engineInterface) {
                    engineInterface.sendCommand('stop');
                    return true;
                }
                return false;
            },

            continueAnalysis: () => {
                const { isAnalyzing, searchDepth, engineReady, engineInterface } = get();
                if (!isAnalyzing || !engineReady || !engineInterface) return false;

                const currentFen = useGameStore.getState().currentPositionFen;

                engineInterface.sendCommand('stop');
                engineInterface.sendCommand('position fen ' + currentFen);
                engineInterface.sendCommand(`go depth ${searchDepth}`);
                return true;
            },

            updatePosition: (fen) => {
                if (!fen) return false;

                const { isAnalyzing, analysisHistory, engineInterface } = get();

                // Check if we have cached analysis for this position
                if (analysisHistory[fen] && analysisHistory[fen].length > 0) {
                    set({ currentLines: analysisHistory[fen] });
                } else {
                    set({ currentLines: [] });
                }

                if (!isAnalyzing) return true;

                // Restart analysis with new position
                if (engineInterface) {
                    engineInterface.sendCommand('stop');
                    engineInterface.sendCommand('position fen ' + fen);
                    engineInterface.sendCommand(`go depth ${get().searchDepth}`);
                    return true;
                }
                return false;
            },

            // Process engine output
            handleEngineMessage: (message) => {
                if (typeof message !== 'string') return;

                // Only process evaluation messages
                if (!message.includes('info') || !message.includes('score') || !message.includes('pv')) {
                    return;
                }

                try {
                    const state = get();
                    let lines = [...state.currentLines];
                    const currentFen = useGameStore.getState().currentPositionFen;
                    const chess = new Chess(currentFen);
                    const isBlackToMove = chess.turn() === 'b';

                    // Extract multipv index
                    const multipvMatch = message.match(/multipv (\d+)/);
                    if (!multipvMatch) return;

                    const lineIndex = parseInt(multipvMatch[1]) - 1;

                    // Extract depth
                    const depthMatch = message.match(/depth (\d+)/);
                    if (!depthMatch) return;

                    const currentDepth = parseInt(depthMatch[1]);

                    // Extract and adjust score based on turn
                    const score = parseScore(message, isBlackToMove);

                    // Extract and validate moves
                    const validMoves = parsePV(message, currentFen);

                    // Skip incomplete analyses
                    if (validMoves.length === 0) return;

                    // Update the line
                    lines[lineIndex] = {
                        score,
                        moves: validMoves,
                        depth: currentDepth
                    };

                    // Update state with new analysis
                    const newLines = lines.filter(line => line !== undefined);

                    // Cache this analysis
                    const updatedHistory = {
                        ...state.analysisHistory,
                        [currentFen]: newLines
                    };

                    set({
                        currentLines: newLines,
                        depth: Math.max(currentDepth, state.depth),
                        engineThinking: message,
                        analysisHistory: updatedHistory
                    });
                } catch (error) {
                    console.error('Error processing engine message:', error, message);
                }
            },

            // Utility functions
            clearAnalysisCache: () => {
                set({ analysisHistory: {} });
                return true;
            },

            getEvaluation: () => {
                const { currentLines } = get();
                if (currentLines.length === 0) return null;

                // Return the top line's score
                return currentLines[0]?.score || null;
            }
        }),
        {
            name: ENGINE_CONSTANTS.STORAGE_KEY,
            partialize: (state) => ({
                multipv: state.multipv,
                searchDepth: state.searchDepth
            }),
        }
    )
);