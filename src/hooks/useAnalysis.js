import {useState, useEffect, useRef} from 'react';
import {useEngineStore} from './stores/useEngineStore';
import {Chess} from 'cm-chess';

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

/**
 * Throttled analysis hook that processes raw engine data for UI
 */
export function useAnalysis() {
    // Select necessary state from the engine store
    const currentLines = useEngineStore(state => state.currentLines);
    const turn = useEngineStore(state => state.turn);
    const currentFen = useEngineStore(state => state.currentFen);

    // State to hold the processed analysis results
    const [analysisResult, setAnalysisResult] = useState({
        advantage: null,
        cp: null,
        mate: null,
        formattedEvaluation: null,
        sanLines: [],
        lineEvaluations: [],
    });

    // Refs for throttling
    const timeoutRef = useRef(null);
    const pendingUpdateRef = useRef(false);
    const inputsRef = useRef({currentLines, turn, currentFen});

    // Process the engine lines
    const processLines = () => {
        const {currentLines, turn, currentFen} = inputsRef.current;

        // Filter out null lines from the fixed-size array
        const validLines = currentLines.filter(line => line !== null);

        // Process each line to extract formatted evaluations and convert UCI to SAN
        const processedLines = validLines.map(line => {
            // Determine advantage based on score and current turn
            let advantage;
            let score;

            // Convert centipawns to pawns if it's a cp score
            if (line.scoreType === 'cp') {
                score = line.scoreValue / 100; // Now we convert centipawns to pawns here
            } else {
                score = line.scoreValue; // Mate score stays as is
            }

            // Adjust score perspective based on turn
            if (turn === 'b') {
                score = -score;
            }

            if (score > 0.0) {
                advantage = 'white';
            } else if (score < 0.0) {
                advantage = 'black';
            } else {
                advantage = 'equal';
            }

            // Calculate cp and mate values
            let cp = null;
            let mate = null;
            let formattedEvaluation;

            if (line.scoreType === 'mate') {
                mate = Math.abs(line.scoreValue);
                cp = Infinity;
                formattedEvaluation = `#${mate}`;
            } else {
                cp = Math.abs(score * 100); // Convert back to absolute centipawns for UI
                mate = null;

                if (score > 0) {
                    formattedEvaluation = `+${score.toFixed(2)}`;
                } else if (score < 0) {
                    formattedEvaluation = score.toFixed(2);
                } else {
                    formattedEvaluation = "(º～º)";
                }
            }

            // Convert UCI moves to SAN format
            const sanMoves = formatUciMoves(currentFen, line.pvMoves || []);

            return {
                sanMoves,
                evaluation: {
                    advantage,
                    cp,
                    mate,
                    formattedEvaluation
                }
            };
        });

        // Extract arrays of SAN moves and evaluations
        const sanLines = processedLines.map(line => line.sanMoves);
        const lineEvaluations = processedLines.map(line => line.evaluation);

        // Get best line evaluation (first line)
        const bestEval = processedLines[0]?.evaluation || {
            advantage: 'equal',
            cp: null,
            mate: null,
            formattedEvaluation: '(º～º)'
        };

        setAnalysisResult({
            advantage: bestEval.advantage,
            cp: bestEval.cp,
            mate: bestEval.mate,
            formattedEvaluation: bestEval.formattedEvaluation,
            sanLines,
            lineEvaluations,
        });
    };

    // Effect to handle throttled updates
    useEffect(() => {
        // Update the inputs ref
        inputsRef.current = {currentLines, turn, currentFen};

        // Set pending flag
        pendingUpdateRef.current = true;

        // If no update is scheduled, schedule one
        if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                // Only process if there's a pending update
                if (pendingUpdateRef.current) {
                    processLines();
                    pendingUpdateRef.current = false;
                }
                timeoutRef.current = null;

                // If changes occurred during processing, schedule another update
                if (pendingUpdateRef.current) {
                    timeoutRef.current = setTimeout(() => {
                        processLines();
                        pendingUpdateRef.current = false;
                        timeoutRef.current = null;
                    }, 100);
                }
            }, 100);
        }

        // Cleanup function
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [currentLines, turn, currentFen]);

    return analysisResult;
}