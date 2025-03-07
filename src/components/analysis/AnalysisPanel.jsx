import React, { memo } from "react";
import { EngineLine } from "./EngineLine";
import { AnalysisPanelHeader } from "./AnalysisPanelHeader";
import { useAnalysisPanel } from "../../hooks/useAnalysisPanel";

/**
 * AnalysisPanel component that displays computer analysis and evaluation.
 * All logic has been moved to the useAnalysisPanel custom hook.
 */
export const AnalysisPanel = memo(function AnalysisPanel() {
    // Get all state and handlers from the custom hook
    const {
        uciLines,
        lineEvaluations,
        handleMoveClick,
        showEmptyPrompt,
        isAnalyzing
    } = useAnalysisPanel();

    return (
        <div className="flex min-h-fit flex-col bg-slate-800 rounded-lg">
            <AnalysisPanelHeader />

            <div className="flex flex-1 flex-col divide-y divide-slate-700">
                {uciLines.map((line, idx) => (
                    <EngineLine
                        key={idx}
                        uciMoves={line}
                        evaluation={lineEvaluations[idx]}
                        isMainLine={idx === 0}
                        isLastLine={idx === uciLines.length - 1}
                        onMoveClick={handleMoveClick}
                    />
                ))}

                {showEmptyPrompt && (
                    <div className="p-4 text-base text-slate-400 text-center">
                        Click the toggle to turn on computer analysis.
                    </div>
                )}

                {isAnalyzing && (
                    <div className="p-4 text-base text-slate-400 text-center">
                        Analyzing position...
                    </div>
                )}
            </div>
        </div>
    );
});