import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useEngineStore = create(
    persist(
        (set, get) => ({
            // Analysis state
            engineInterface: null, // Engine interface instance
            isInitialized: false, // Whether the engine has been set up

            // engine configuration
            multiPV: null,
            isMultiPVFlushed: false,

            // not technically engine configuration, but related
            goalSearchDepth: null, // Desired search depth
            isGoalSearchDepthFlushed: false,

            // Analysis state
            isAnalyzing: false, // Whether engine is analyzing
            isAnalysisOn: false, // Whether analysis mode is on
            currentSearchDepth: 0,
            currentLines: [],

            // updated together
            startFen: null, // FEN of the starting position
            currentFen: null, // FEN of the current position
            uciMoves: '', // UCI moves to reach current position from starting position
            turn: null, // Current turn (w or b)

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
                set({ multiPV: value, isMultiPVFlushed: false });
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
                console.log('[Engine message]:', message);

                // Parse info strings that contain analysis data
                if (message.startsWith('info')) {
                    // Extract depth information
                    const depthMatch = message.match(/depth (\d+)/);
                    if (depthMatch) {
                        const depth = parseInt(depthMatch[1], 10);
                        set({ currentSearchDepth: depth });
                    }

                    // Extract multipv, score, and moves information (only process complete analysis lines)
                    const hasPv = message.includes(' pv ');
                    const hasMultiPv = message.includes(' multipv ');
                    const hasScore = message.includes(' score ');

                    if (hasPv && hasMultiPv && hasScore) {
                        try {
                            // Extract multipv index (line number)
                            const multiPvMatch = message.match(/multipv (\d+)/);
                            const multiPvIndex = multiPvMatch ? parseInt(multiPvMatch[1], 10) : 1;

                            // Extract score information
                            let scoreValue = 0;
                            let scoreType = 'cp';

                            const mateMatch = message.match(/score mate (-?\d+)/);
                            const cpMatch = message.match(/score cp (-?\d+)/);

                            if (mateMatch) {
                                scoreValue = parseInt(mateMatch[1], 10);
                                scoreType = 'mate';
                            } else if (cpMatch) {
                                scoreValue = parseInt(cpMatch[1], 10) / 100; // Convert centipawns to pawns
                                scoreType = 'cp';
                            }

                            // Extract PV (move sequence)
                            const pvMatch = message.match(/ pv (.+)$/);
                            const pvMoves = pvMatch ? pvMatch[1].trim().split(' ') : [];

                            // Create the analysis line object
                            const analysisLine = {
                                multiPvIndex,
                                scoreType,
                                scoreValue,
                                pvMoves,
                                depth: depthMatch ? parseInt(depthMatch[1], 10) : 0,
                                updatedAt: Date.now()
                            };

                            // Update the current lines in the store
                            const { currentLines } = get();
                            const updatedLines = [...currentLines];

                            // Find and update or add the line at the correct index
                            const lineIndex = updatedLines.findIndex(line => line.multiPvIndex === multiPvIndex);

                            if (lineIndex !== -1) {
                                updatedLines[lineIndex] = analysisLine;
                            } else {
                                updatedLines.push(analysisLine);
                            }

                            // Sort lines by multiPvIndex
                            updatedLines.sort((a, b) => a.multiPvIndex - b.multiPvIndex);

                            // Update the store
                            set({ currentLines: updatedLines });
                        } catch (error) {
                            console.error('Error parsing engine message:', error, message);
                        }
                    }
                }

                // Handle "bestmove" messages when engine completes analysis
                else if (message.startsWith('bestmove')) {
                    // When engine completes analysis to requested depth, it sends bestmove
                    // We can use this to potentially take further action, but we typically
                    // don't stop analysis mode based on this alone
                    set({ isAnalyzing: false });

                    // You might want to add logic here for when analysis completes to desired depth
                    // For continuous analysis, you'd typically restart analysis with go()
                    const { isAnalysisOn, go } = get();
                    if (isAnalysisOn) {
                        // Small delay before restarting analysis to give UI time to update
                        setTimeout(() => {
                            go();
                        }, 100);
                    }
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