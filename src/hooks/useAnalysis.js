import { useMemo } from 'react';
import { useEngineStore } from './stores/useEngineStore';
import { shallow } from 'zustand/shallow';
import { Chess } from 'cm-chess';

/**
 * Custom hook that provides a simplified interface for chess analysis
 * @returns {Object} Analysis state and functions
 */
export function useAnalysis() {
    // Select necessary state and functions from the engine store
    const {
        currentLines,
        turn,
        currentFen,
        isAnalyzing,
        isAnalysisOn,
        currentSearchDepth,
        isEngineReady,
        startAnalysis,
        endAnalysis,
        multiPV,
        setAndSendMultiPV,
        goalSearchDepth,
        setGoalSearchDepth,
        setPositionAndGoIfAnalysisOn,
    } = useEngineStore(
        state => ({
            currentLines: state.currentLines,
            turn: state.turn,
            currentFen: state.currentFen,
            isAnalyzing: state.isAnalyzing,
            isAnalysisOn: state.isAnalysisOn,
            currentSearchDepth: state.currentSearchDepth,
            isEngineReady: state.isEngineReady,
            startAnalysis: state.startAnalysis,
            endAnalysis: state.endAnalysis,
            multiPV: state.multiPV,
            setAndSendMultiPV: state.setAndSendMultiPV,
            goalSearchDepth: state.goalSearchDepth,
            setGoalSearchDepth: state.setGoalSearchDepth,
            setPositionAndGoIfAnalysisOn: state.setPositionAndGoIfAnalysisOn,
        }),
        shallow
    );

    /**
     * Converts UCI moves to SAN format
     * @param {string} currentFen - The current FEN position
     * @param {Array<string>} uciMoves - Array of UCI format moves
     * @returns {Array<object>} Array of formatted moves with SAN notation
     */
    const formatUciMoves = (currentFen, uciMoves) => {
        const formattedMoves = [];
        let position = new Chess(currentFen);

        for (const uciMove of uciMoves) {
            // Skip processing if we've reached an invalid position
            if (position.gameOver()) {
                break;
            }

            // Try to make the move
            const move = position.move(uciMove);
            if (!move) {
                console.error(`Invalid move in engine analysis: ${uciMove} in position ${position.fen()}`);
                break;
            }

            formattedMoves.push(move);
        }

        return formattedMoves;
    };

    // Process and format the analysis results
    const analysisResults = useMemo(() => {
        if (!currentLines || currentLines.length === 0 || !currentFen) {
            return {
                advantage: null,
                cp: null,
                mate: null,
                formattedEvaluation: null,
                sanLines: null,
                lineEvaluations: null,
            };
        }

        // Process each line to extract formatted evaluations and convert UCI to SAN (placeholder)
        const processedLines = currentLines.map(line => {
            // Determine advantage based on score and current turn
            let advantage;
            let score = line.scoreValue;

            // Adjust score perspective based on turn
            // In UCI, scores are always from the perspective of the side to move
            // We want consistent white/black perspective regardless of turn
            if (turn === 'b') {
                score = -score;
            }

            if (score > 0.3) {
                advantage = 'white';
            } else if (score < -0.3) {
                advantage = 'black';
            } else {
                advantage = 'equal';
            }

            // Calculate cp and mate values (always positive for UI)
            let cp = null;
            let mate = null;
            let formattedEvaluation;

            if (line.scoreType === 'mate') {
                mate = Math.abs(line.scoreValue);
                cp = Infinity;
                formattedEvaluation = `#${mate}`;
            } else {
                cp = Math.abs(score * 100); // Convert to centipawns and make positive
                mate = null;

                // Format evaluation string with + for white advantage, - for black advantage
                if (score > 0) {
                    formattedEvaluation = `+${score.toFixed(2)}`;
                } else if (score < 0) {
                    formattedEvaluation = score.toFixed(2); // Already has negative sign
                } else {
                    formattedEvaluation = "0.00";
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
            advantage: null,
            cp: null,
            mate: null,
            formattedEvaluation: null
        };

        return {
            // Top-level evaluation (from best line)
            advantage: bestEval.advantage,
            cp: bestEval.cp,
            mate: bestEval.mate,
            formattedEvaluation: bestEval.formattedEvaluation,

            // All lines data
            sanLines,
            lineEvaluations,
        };
    }, [currentLines, turn, currentFen]);

    // Combine everything into the required output format
    return {
        // Analysis results
        ...analysisResults,

        // Control functions
        multiPV,
        setAndSendMultiPV,
        goalSearchDepth,
        setGoalSearchDepth,
        currentSearchDepth,
        isAnalysisOn,
        isAnalyzing,
        startAnalysis,
        endAnalysis,
        setPositionAndGoIfAnalysisOn,
        isEngineReady
    };
}