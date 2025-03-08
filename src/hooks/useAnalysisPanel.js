import { useCallback } from 'react';
import { useGameActions } from './stores/useGameStore';
import { useEngineAnalysis, useIsAnalysisOn } from './stores/useEngineStore';

/**
 * Custom hook that contains all the logic for the AnalysisPanel component
 *
 * @returns {Object} State and handlers for the AnalysisPanel component
 */
export function useAnalysisPanel() {
    // Get analysis data from engine store
    const { uciLines, lineEvaluations } = useEngineAnalysis();

    // Get engine analysis state
    const isAnalysisOn = useIsAnalysisOn();

    // Get game actions
    const { makeMove } = useGameActions();

    // Handler for clicking on moves in the analysis lines
    const handleMoveClick = useCallback(
        sanMoves => {
            for (let i = 0; i < sanMoves.length; i++) {
                console.assert(makeMove(sanMoves[i]), `Failed to make move: ${sanMoves[i]}`);
            }
        },
        [makeMove]
    );

    // Computed properties
    const showEmptyMessage = uciLines.length === 0;
    const isAnalyzing = showEmptyMessage && isAnalysisOn;
    const showEmptyPrompt = showEmptyMessage && !isAnalysisOn;

    // Return all state and handlers needed by the component
    return {
        // Analysis data
        uciLines,
        lineEvaluations,
        isAnalysisOn,

        // Handlers
        handleMoveClick,

        // Computed properties
        showEmptyPrompt,
        isAnalyzing,
    };
}
