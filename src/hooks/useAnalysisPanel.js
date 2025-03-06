import { useCallback } from 'react';
import { useGameActions } from "./stores/useGameStore";
import {
    useCurrentSearchDepth,
    useEngineActions,
    useEngineAnalysis,
    useEngineConfig,
    useIsAnalysisOn,
    useIsEngineReady
} from "./stores/useEngineStore";

/**
 * Custom hook that contains all the logic for the AnalysisPanel component
 *
 * @returns {Object} State and handlers for the AnalysisPanel component
 */
export function useAnalysisPanel() {
    // Get analysis data from engine store
    const { uciLines, lineEvaluations, formattedEvaluation, advantage } = useEngineAnalysis();

    // Get engine actions
    const { startAnalysis, endAnalysis, setAndSendMultiPV, setGoalSearchDepth } = useEngineActions();

    // Get engine state
    const isAnalysisOn = useIsAnalysisOn();
    const currentSearchDepth = useCurrentSearchDepth();
    const isEngineReady = useIsEngineReady();
    const { multiPV, goalSearchDepth } = useEngineConfig();

    // Get game actions
    const { makeMove } = useGameActions();

    // Handler for clicking on moves in the analysis lines
    const handleMoveClick = useCallback((sanMoves) => {
        for (let i = 0; i < sanMoves.length; i++) {
            console.assert(makeMove(sanMoves[i]), `Failed to make move: ${sanMoves[i]}`);
        }
    }, [makeMove]);

    // Return all state and handlers needed by the component
    return {
        // Analysis data
        uciLines,
        lineEvaluations,
        formattedEvaluation,
        advantage,

        // Engine state
        isAnalysisOn,
        currentSearchDepth,
        isEngineReady,
        multiPV,
        goalSearchDepth,

        // Handlers
        startAnalysis,
        endAnalysis,
        setAndSendMultiPV,
        setGoalSearchDepth,
        handleMoveClick,

        // Computed properties
        showEmptyAnalysisMessage: uciLines.length === 0,
        isAnalyzing: isAnalysisOn && uciLines.length === 0
    };
}