import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'cm-chess';

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
            multipv: ENGINE_CONSTANTS.DEFAULT_MULTIPV,
            currentSearchDepth: 0,
            goalSearchDepth: ENGINE_CONSTANTS.DEFAULT_SEARCH_DEPTH,
            currentLines: [],

            fenPosition: '',
            uciMoves: [],
            turn: '',

            // Reference to hold engine functions (set from outside)
            engineInterface: null,

            // Set the engine interface (called from EngineProvider)
            setEngineInterface: (engine) => {
                // Only update if engine is valid and different
                if (engine && engine !== get().engineInterface) {
                    set({ engineInterface: engine });
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
                const { engineInterface } = get();
                engineInterface.sendCommand('stop');
                engineInterface.configure({ MultiPV: newValue });
            },

            setSearchDepth: (value) => {
                const newDepth = parseInt(value);
                if (isNaN(newDepth) || newDepth < ENGINE_CONSTANTS.MIN_SEARCH_DEPTH || newDepth > ENGINE_CONSTANTS.MAX_SEARCH_DEPTH) return;

                set({ goalSearchDepth: newDepth });
            },

            isEngineReady: () => {
                const { engineReady, engineInterface } = get();
                return engineReady && engineInterface !== null;
            },

            go: () => {
                const { goalSearchDepth, engineInterface, fenPosition, uciMoves } = get();

                engineInterface.sendCommand('stop');
                engineInterface.sendCommand('position fen ' + fenPosition + (uciMoves ? ' moves ' + uciMoves : ''));
                engineInterface.sendCommand(`go depth ${goalSearchDepth}`);
            },

            stop: () => {
                const { engineInterface } = get();
                set({ isAnalyzing: false });
                engineInterface.sendCommand('stop');
            },

            updatePosition: (fenPosition, uciMoves, turn) => {
                set({fenPosition, uciMoves, turn});
            },

            goIfAnalyzing: () => {
                const { isEngineReady, isAnalyzing, go } = get();

                if (isEngineReady() && isAnalyzing ) {
                    go();
                }
            },

            updatePositionAndGoIfAnalyzing: (fenPosition, uciMoves, turn) => {
                const { updatePosition, goIfAnalyzing } = get();

                updatePosition(fenPosition, uciMoves, turn);
                goIfAnalyzing();
            },

            // Process engine output
            handleEngineMessage: (message) => {
                if (typeof message !== 'string') return;

                // Only process evaluation messages
                if (!message.includes('info') || !message.includes('score') || !message.includes('pv')) {
                    return;
                }

                try {
                    const { currentFen, isBlackToMove, currentLines } = get();
                    let lines = [...currentLines];

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
                        currentSearchDepth: currentDepth
                    };

                    // Update state with new analysis
                    const newLines = lines.filter(line => line !== undefined);

                    set({
                        currentLines: newLines,
                        currentSearchDepth: currentDepth,
                    });
                } catch (error) {
                    console.error('Error processing engine message:', error, message);
                }
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
                goalSearchDepth: state.goalSearchDepth
            }),
        }
    )
);