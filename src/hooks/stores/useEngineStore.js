import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {Chess, FEN} from "cm-chess";

/**
 * Converts UCI moves to SAN format strings
 * @param {string} currentFen - The current FEN position
 * @param {Array<string>} uciMoves - Array of UCI format moves
 * @returns {Array<string>} Array of SAN notation strings
 */
const formatUciMoves = (currentFen, uciMoves) => {
    if (!currentFen || !uciMoves || uciMoves.length === 0) {
        return [];
    }

    const formattedMoves = [];
    let position = new Chess(currentFen);

    for (const uciMove of uciMoves) {
        // Skip processing if we've reached an invalid position
        if (position.gameOver()) {
            break;
        }

        try {
            // Convert UCI to move object that Chess.js can understand
            const from = uciMove.substring(0, 2);
            const to = uciMove.substring(2, 4);
            const promotion = uciMove.length > 4 ? uciMove.substring(4, 5) : undefined;

            const move = position.move({from, to, promotion});
            if (!move) {
                console.error(`Invalid move in engine analysis: ${uciMove} in position ${position.fen()}`);
                break;
            }

            // Just extract the SAN notation string instead of the whole move object
            formattedMoves.push(move.san);
        } catch (error) {
            break;
        }
    }

    return formattedMoves;
}

const processLines = (currentLines, currentFen) => {
    // Filter out null lines from the fixed-size array
    const validLines = currentLines.filter(line => line !== null);

    // Process each line to extract formatted evaluations and convert UCI to SAN
    const processedLines = validLines.map(line => {
        // Determine advantage based on score and current turn
        let formattedEvaluation;

        if (line.mate !== null) {
            formattedEvaluation = `#${line.mate}`;
        } else {
            formattedEvaluation = `${line.advantage === 'black' ? '-' : '+'}${(line.cp / 100).toFixed(2)}`;
        }

        return {
            uciMoves: line.pvMoves,
            evaluation: {
                advantage: line.advantage,
                cp: line.cp,
                mate: line.mate,
                formattedEvaluation
            }
        };
    });

    const uciLines = processedLines.map(line => line.uciMoves);
    const lineEvaluations = processedLines.map(line => line.evaluation);

    // Get best line evaluation (first line)
    const bestEval = processedLines[0]?.evaluation || {
        advantage: 'equal',
        cp: null,
        mate: null,
        formattedEvaluation: '(º~º)'
    };

    return {
        advantage: bestEval.advantage,
        cp: bestEval.cp,
        mate: bestEval.mate,
        formattedEvaluation: bestEval.formattedEvaluation,
        uciLines,
        lineEvaluations,
    };
};

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
            time: 0,
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

            go: () => {
                const { isEngineReady, goalSearchDepth, multiPV, currentFen, engineInterface } = get();
                if (!isEngineReady()) {
                    console.error('Engine is not ready to start analysis');
                    return;
                }

                if (!goalSearchDepth) {
                    console.error('Goal search depth must be set before starting analysis');
                    return;
                }

                set({ isAnalyzing: true, isGoalSearchDepthFlushed: true, time: 0, currentLines: Array(multiPV).fill(null) });

                engineInterface.sendCommand('stop');
                // engineInterface.sendCommand('position fen ' + startFen + (uciMoves ? ' moves ' + uciMoves : ''));
                engineInterface.sendCommand('position fen ' + currentFen);
                engineInterface.sendCommand(`go depth ${goalSearchDepth}`);
            },

            endAnalysis: () => {
                const { multiPV, engineInterface } = get();
                set({
                    isAnalysisOn: false,
                    isAnalyzing: false,
                    currentLines: Array(multiPV).fill(null),
                });
                engineInterface.sendCommand('stop');
            },

            startAnalysis: () => {
                set({ isAnalysisOn: true });

                get().go();
            },

            setPosition: (startFen, currentFen, uciMoves, turn) => {
                set({startFen, currentFen, uciMoves, turn, currentSearchDepth: 0, currentLines: Array(get().multiPV).fill(null) });
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

            getAnalysis: () => {
                const { currentLines, currentFen } = get();
                return processLines(currentLines, currentFen);
            },

            // Process engine output
            handleEngineMessage: (message) => {
                const { isAnalysisOn, time } = get();

                // Skip processing empty messages
                if (!message || typeof message !== 'string') return;

                // console.log('[Engine message]:', message);

                // Parse info strings that contain analysis data
                if (message.startsWith('info')) {
                    if (message === 'readyok') {
                        set({ isInitialized: true });
                    }

                    else if (!isAnalysisOn) {
                        return;
                    }

                    // Extract depth information
                    const depthMatch = message.match(/depth (\d+)/);
                    if (depthMatch) {
                        const depth = parseInt(depthMatch[1], 10);
                        set({ currentSearchDepth: depth });
                    }

                    const timeMatch = message.match(/time (\d+)/);
                    if (timeMatch) {
                        const parsedTime = parseInt(timeMatch[1], 10);
                        if (parsedTime < time) {
                            console.log('Time decreased:', parsedTime, time);
                            return;
                        }
                        else if (time === 0) {
                            if (parsedTime > 100) {
                                console.warn('Time is too high, skipping. Time:', parsedTime);
                                return;
                            }
                        }
                        set({ time: parsedTime });
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
                            const { multiPV, turn } = get();
                            if (multiPvIndex > multiPV) return;

                            // Extract score information - store raw values only
                            let scoreValue = 0;
                            let cp;
                            let mate;

                            const mateMatch = message.match(/score mate (-?\d+)/);
                            const cpMatch = message.match(/score cp (-?\d+)/);

                            if (mateMatch) {
                                scoreValue = parseInt(mateMatch[1], 10);
                                mate = Math.abs(scoreValue);
                                cp = Infinity;
                            } else if (cpMatch) {
                                scoreValue = parseInt(cpMatch[1], 10); // Keep as centipawns
                                cp = Math.abs(scoreValue);
                                mate = null;
                            }

                            const [self_color, opponent_color] = turn === 'w' ? ['white', 'black'] : ['black', 'white'];
                            const advantage = scoreValue > 0 ? self_color : opponent_color;

                            // Extract PV (move sequence) - just the raw UCI moves
                            const pvMatch = message.match(/ pv ([^$]*)/);
                            const pvMoves = pvMatch ? pvMatch[1].trim().split(' ') : [];

                            // Create the raw analysis line object - minimal processing
                            const analysisLine = {
                                multiPvIndex,
                                cp,
                                mate,
                                advantage,
                                pvMoves,
                                depth: depthMatch ? parseInt(depthMatch[1], 10) : 0,
                            };

                            // Update the current lines in the store using fixed-size array approach
                            set((state) => {
                                // Create a new array of the current size if needed
                                let updatedLines = Array(state.multiPV).fill(null);

                                for (let i = 0; i < state.currentLines.length; i++) {
                                    updatedLines[i] = state.currentLines[i];
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
                    else {
                        console.warn('Skipping incomplete analysis:', message);
                    }
                }

                // Handle "bestmove" messages when engine completes analysis
                else if (message.startsWith('bestmove')) {
                    set({ isAnalyzing: false });
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