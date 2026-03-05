import React, { memo } from 'react';
import { EngineLine } from './EngineLine';
import { AnalysisPanelHeader } from './AnalysisPanelHeader';
import { useAnalysisPanel } from '../../hooks/useAnalysisPanel';

/**
 * AnalysisPanel component that displays computer analysis and evaluation.
 * All logic has been moved to the useAnalysisPanel custom hook.
 */
export const AnalysisPanel = memo(function AnalysisPanel() {
    // Get all state and handlers from the custom hook
    const { uciLines, lineEvaluations, handleMoveClick, showEmptyPrompt, isAnalyzing } =
        useAnalysisPanel();

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
                    <div className="p-4 text-base text-slate-400 text-center flex items-center justify-center gap-2">
                        <svg
                            className="animate-spin h-4 w-4 text-slate-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Analyzing position...
                    </div>
                )}
            </div>
        </div>
    );
});
