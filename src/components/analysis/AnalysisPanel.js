import React from "react";
import { EngineLine } from "./EngineLine";
import { AnalysisPanelHeader } from "./AnalysisPanelHeader";
import { useGameActions } from "../../hooks/stores/useGameStore";
import { useEngineAnalysis, useIsAnalysisOn } from "../../hooks/stores/useEngineStore";

export function AnalysisPanel() {
    const { uciLines, lineEvaluations } = useEngineAnalysis();

    const isAnalysisOn = useIsAnalysisOn();

    const { makeMove } = useGameActions();

    const handleMoveClick = (sanMoves) => {
        for (let i = 0; i < sanMoves.length; i++) {
            console.assert(makeMove(sanMoves[i]), `Failed to make move: ${sanMoves[i]}`);
        }
    };

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

                {uciLines.length === 0 && !isAnalysisOn && (
                    <div className="p-4 text-sm text-slate-400 text-center">
                        Click the toggle to turn on computer analysis.
                    </div>
                )}

                {uciLines.length === 0 && isAnalysisOn && (
                    <div className="p-4 text-sm text-slate-400 text-center">
                        Analyzing position...
                    </div>
                )}
            </div>
        </div>
    );
}