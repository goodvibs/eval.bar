import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {FEN} from "cm-chess";

export const useEngineStore = create(
    persist(
        (set, get) => ({
            // Analysis state
            engineInterface: null, // Engine interface instance
            isInitialized: false, // Whether the engine has been set up

            // engine configuration
            multiPV: 3,
            isMultiPVFlushed: false,

            // not technically engine configuration, but related
            goalSearchDepth: 20, // Desired search depth
            isGoalSearchDepthFlushed: false,

            // Analysis state
            isAnalyzing: false, // Whether engine is analyzing
            isAnalysisOn: false, // Whether analysis mode is on
            currentSearchDepth: 0,
            currentLines: Array(3).fill(null), // Current analysis lines

            // updated together
            startFen: FEN.start, // FEN of the starting position
            currentFen: FEN.start, // FEN of the current position
            uciMoves: '', // UCI moves to reach current position from starting position
            turn: 'w', // Current turn (w or b)

            // Set the engine interface (called from EngineProvider)
            setEngineInterface: (engine) => {
                // Only update if engine is valid and different
                if (engine && engine !== get().engineInterface) {
                    set({ engineInterface: engine });
                }
            },

            // Set engine ready status
            setIsInitialized: (isInitialized) => set({ isInitialized: isInitialized }),

            setMultiPV: (value) => {
                set((state) => {
                    // Create new array for the lines with the new size
                    let newLines;

                    if (value > state.multiPV) {
                        // Expanding - create larger array and copy existing values
                        newLines = Array(value).fill(null);
                        state.currentLines.forEach((line, index) => {
                            if (line) newLines[index] = line;
                        });
                    } else {
                        // Shrinking - truncate the array
                        newLines = state.currentLines.slice(0, value);
                    }

                    return {
                        multiPV: value,
                        isMultiPVFlushed: false,
                        currentLines: newLines
                    };
                });
            },

            sendMultiPV: () => {
                const { engineInterface, multiPV } = get();
                engineInterface.configure({ MultiPV: multiPV });
                set({ isMultiPVFlushed: true });
            },

            setAndSendMultiPV: (value) => {
                const { setMultiPV, sendMultiPV } = get();
                setMultiPV(value);
                sendMultiPV();
            },

            setGoalSearchDepth: (value) => {
                set({ goalSearchDepth: value });
                set({ isGoalSearchDepthFlushed: false });
            },

            isEngineReady: () => {
                const { isInitialized, engineInterface, multiPV, goalSearchDepth, startFen, currentFen, turn, isMultiPVFlushed } = get();
                return isInitialized &&
                    engineInterface !== null &&
                    multiPV !== null &&
                    goalSearchDepth !== null &&
                    startFen !== null &&
                    currentFen !== null &&
                    turn !== null &&
                    isMultiPVFlushed;
            },

            pauseAnalysis: () => {
                const { engineInterface } = get();
                set({ isAnalyzing: false });
                engineInterface.sendCommand('stop');
            },

            go: () => {
                const { goalSearchDepth, engineInterface, currentFen, pauseAnalysis, isEngineReady} = get();
                if (!isEngineReady()) {
                    console.error('Engine is not ready to start analysis');
                    return;
                }

                if (!goalSearchDepth) {
                    console.error('Goal search depth must be set before starting analysis');
                    return;
                }

                pauseAnalysis();
                // engineInterface.sendCommand('position fen ' + startFen + (uciMoves ? ' moves ' + uciMoves : ''));
                engineInterface.sendCommand('position fen ' + currentFen);
                engineInterface.sendCommand(`go depth ${goalSearchDepth}`);

                set({ isAnalyzing: true, isGoalSearchDepthFlushed: true });
            },

            endAnalysis: () => {
                const { pauseAnalysis } = get();
                pauseAnalysis();
                set({
                    isAnalysisOn: false,
                    currentLines: []
                });
            },

            startAnalysis: () => {
                const { go } = get();

                set({ isAnalysisOn: true });

                go();
            },

            setPosition: (startFen, currentFen, uciMoves, turn) => {
                set({startFen, currentFen, uciMoves, turn });
            },

            goIfAnalysisOn: () => {
                const { isAnalysisOn, go } = get();

                if (isAnalysisOn ) {
                    go();
                }
            },

            setPositionAndGoIfAnalysisOn: (startFen, currentFen, uciMoves, turn) => {
                const { setPosition, goIfAnalysisOn } = get();
                setPosition(startFen, currentFen, uciMoves, turn);
                goIfAnalysisOn();
            },

            // Process engine output
            handleEngineMessage: (message) => {
                // Skip processing empty messages
                if (!message || typeof message !== 'string') return;

                console.log('[Engine message]:', message);

                // Parse info strings that contain analysis data
                if (message.startsWith('info')) {
                    // Extract depth information
                    const depthMatch = message.match(/depth (\d+)/);
                    if (depthMatch) {
                        const depth = parseInt(depthMatch[1], 10);
                        set({ currentSearchDepth: depth });
                    }

                    // Only process complete analysis lines
                    const hasPv = message.includes(' pv ');
                    const hasMultiPv = message.includes(' multipv ');
                    const hasScore = message.includes(' score ');

                    if (hasPv && hasMultiPv && hasScore) {
                        try {
                            // Extract multipv index (line number)
                            const multiPvMatch = message.match(/multipv (\d+)/);
                            const multiPvIndex = multiPvMatch ? parseInt(multiPvMatch[1], 10) : 1;

                            // Skip processing if this line is beyond our multiPV setting
                            const { multiPV } = get();
                            if (multiPvIndex > multiPV) return;

                            // Extract score information - store raw values only
                            let scoreValue = 0;
                            let scoreType = 'cp';

                            const mateMatch = message.match(/score mate (-?\d+)/);
                            const cpMatch = message.match(/score cp (-?\d+)/);

                            if (mateMatch) {
                                scoreValue = parseInt(mateMatch[1], 10);
                                scoreType = 'mate';
                            } else if (cpMatch) {
                                scoreValue = parseInt(cpMatch[1], 10); // Keep as centipawns
                                scoreType = 'cp';
                            }

                            // Extract PV (move sequence) - just the raw UCI moves
                            const pvMatch = message.match(/ pv ([^$]*)/);
                            const pvMoves = pvMatch ? pvMatch[1].trim().split(' ') : [];

                            // Create the raw analysis line object - minimal processing
                            const analysisLine = {
                                multiPvIndex,
                                scoreType,
                                scoreValue,
                                pvMoves,
                                depth: depthMatch ? parseInt(depthMatch[1], 10) : 0,
                                updatedAt: Date.now()
                            };

                            // Update the current lines in the store using fixed-size array approach
                            set((state) => {
                                // Create a new array of the current size if needed
                                let updatedLines = [...state.currentLines];

                                // If the array is not initialized to the right size yet,
                                // create a new array with the right size filled with nulls
                                if (updatedLines.length < state.multiPV) {
                                    updatedLines = Array(state.multiPV).fill(null);
                                }

                                // Update the specific index with the new analysis line
                                // Note: multiPvIndex is 1-based, so we use index-1 for 0-based array
                                updatedLines[multiPvIndex - 1] = analysisLine;

                                return { currentLines: updatedLines };
                            });
                        } catch (error) {
                            console.error('Error parsing engine message:', error, message);
                        }
                    }
                }

                // Handle "bestmove" messages when engine completes analysis
                else if (message.startsWith('bestmove')) {
                    set({ isAnalyzing: false });
                }

                // Handle "readyok" messages
                else if (message === 'readyok') {
                    set({ isInitialized: true });
                }
            }
        }),
        {
            name: 'engine-settings',
            partialize: (state) => ({
                multiPV: state.multiPV,
                goalSearchDepth: state.goalSearchDepth,
            }),
        }
    )
);