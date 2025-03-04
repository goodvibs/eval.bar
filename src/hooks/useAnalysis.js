import {useState, useEffect} from 'react';
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
            formattedEvaluation = `${line.advantage === 'black' ? '-' : '+'}${line.cp.toFixed(2) / 100}`;
        }

        // Convert UCI moves to SAN format
        const sanMoves = formatUciMoves(currentFen, line.pvMoves || []);

        return {
            sanMoves,
            evaluation: {
                advantage: line.advantage,
                cp: line.cp,
                mate: line.mate,
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
        formattedEvaluation: '(º~º)'
    };

    return {
        advantage: bestEval.advantage,
        cp: bestEval.cp,
        mate: bestEval.mate,
        formattedEvaluation: bestEval.formattedEvaluation,
        sanLines,
        lineEvaluations,
    };
};

/**
 * Throttled analysis hook that processes raw engine data for UI
 */
export function useAnalysis({ currentLines, turn, currentFen }) {
    // State to hold the processed analysis results
    const [analysisResult, setAnalysisResult] = useState({
        advantage: null,
        cp: null,
        mate: null,
        formattedEvaluation: null,
        sanLines: [],
        lineEvaluations: [],
    });

    // Effect to handle throttled updates
    useEffect(() => {
        setAnalysisResult(processLines(currentLines, currentFen));
    }, [currentFen, currentLines, turn]);

    return analysisResult;
}