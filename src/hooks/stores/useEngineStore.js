import { create } from 'zustand';
import { useGameStore } from "./useGameStore";
import { Chess } from "cm-chess";
import { persist } from 'zustand/middleware';

// Helper functions to keep store logic clean
const parsePV = (message, currentFen) => {
    const pvIndex = message.indexOf(' pv ') + 4;
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
            depth: 0,
            multipv: 3,
            searchDepth: 20, // Configurable search depth
            currentLines: [],
            engineThinking: '',
            analysisHistory: {}, // Stores analysis keyed by FEN

            // Settings
            setMultiPV: (value) => {
                const newValue = parseInt(value);
                if (isNaN(newValue) || newValue < 1 || newValue > 5) return;

                set({ multipv: newValue });

                // Update engine setting if analyzing
                if (get().isAnalyzing) {
                    const stockfishInstance = window.stockfish;
                    if (stockfishInstance) {
                        stockfishInstance.postMessage('stop');
                        stockfishInstance.postMessage('setoption name MultiPV value ' + newValue);
                        get().continueAnalysis();
                    }
                }
            },

            setSearchDepth: (value) => {
                const newDepth = parseInt(value);
                if (isNaN(newDepth) || newDepth < 10 || newDepth > 30) return;

                set({ searchDepth: newDepth });

                // Restart analysis with new depth if analyzing
                if (get().isAnalyzing) {
                    get().continueAnalysis();
                }
            },

            // Analysis control functions
            startAnalysis: () => {
                const { multipv, searchDepth } = get();
                console.log(`Starting analysis with MultiPV: ${multipv}, depth: ${searchDepth}`);
                set({ isAnalyzing: true, currentLines: [] });

                const stockfishInstance = window.stockfish;
                if (!stockfishInstance) {
                    console.error("Engine not available");
                    return;
                }

                // Configure and start analysis
                stockfishInstance.postMessage('setoption name MultiPV value ' + multipv);
                stockfishInstance.postMessage('position fen ' + useGameStore.getState().currentPositionFen);
                stockfishInstance.postMessage(`go depth ${searchDepth}`);
            },

            stopAnalysis: () => {
                console.log('Stopping analysis');
                set({ isAnalyzing: false });

                const stockfishInstance = window.stockfish;
                if (stockfishInstance) {
                    stockfishInstance.postMessage('stop');
                }
            },

            continueAnalysis: () => {
                const { isAnalyzing, searchDepth } = get();
                if (!isAnalyzing) return;

                const stockfishInstance = window.stockfish;
                if (!stockfishInstance) return;

                const currentFen = useGameStore.getState().currentPositionFen;

                stockfishInstance.postMessage('stop');
                stockfishInstance.postMessage('position fen ' + currentFen);
                stockfishInstance.postMessage(`go depth ${searchDepth}`);
            },

            updatePosition: (fen) => {
                const { isAnalyzing, analysisHistory } = get();

                // Check if we have cached analysis for this position
                if (analysisHistory[fen] && analysisHistory[fen].length > 0) {
                    set({ currentLines: analysisHistory[fen] });
                } else {
                    set({ currentLines: [] });
                }

                if (!isAnalyzing) return;

                // Restart analysis with new position
                const stockfishInstance = window.stockfish;
                if (stockfishInstance) {
                    stockfishInstance.postMessage('stop');
                    stockfishInstance.postMessage('position fen ' + fen);
                    stockfishInstance.postMessage(`go depth ${get().searchDepth}`);
                }
            },

            // Process engine output
            handleEngineMessage: (message) => {
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
            },

            getEvaluation: () => {
                const { currentLines } = get();
                if (currentLines.length === 0) return null;

                // Return the top line's score
                return currentLines[0]?.score || null;
            }
        }),
        {
            name: 'engine-settings', // localStorage key
            partialize: (state) => ({
                multipv: state.multipv,
                searchDepth: state.searchDepth
            }),
        }
    )
);