import React from "react";
import { EngineLine } from "./EngineLine";
import { useGameStore } from "../../hooks/stores/useGameStore";
import { AnalysisPanelHeader } from "./AnalysisPanelHeader";
import { useAnalysis } from "../../hooks/useAnalysis";

export function AnalysisPanel() {
    const {
        advantage,
        formattedEvaluation,
        sanLines,
        lineEvaluations,
        multiPV,
        setAndSendMultiPV,
        goalSearchDepth,
        setGoalSearchDepth,
        currentSearchDepth,
        isAnalysisOn,
        startAnalysis,
        endAnalysis,
        isEngineReady,
    } = useAnalysis();

    const { makeMove } = useGameStore();

    const handleMoveClick = (sanMoves) => {
        for (let i = 0; i < sanMoves.length; i++) {
            console.assert(makeMove(sanMoves[i]), `Failed to make move: ${sanMoves[i]}`);
        }
    };

    return (
        <div className="flex min-h-fit flex-col bg-slate-800 rounded-lg">
            <AnalysisPanelHeader
                isAnalysisOn={isAnalysisOn}
                depth={currentSearchDepth}
                formattedEvaluation={formattedEvaluation}
                advantage={advantage}
                handleAnalysisOn={startAnalysis}
                handleAnalysisOff={endAnalysis}
                handleMultiPVChange={setAndSendMultiPV}
                handleGoalDepthChange={setGoalSearchDepth}
                engineReady={isEngineReady()}
                goalSearchDepth={goalSearchDepth}
                multiPV={multiPV}
            />

            <div className="flex flex-1 flex-col divide-y divide-slate-700">
                {sanLines.map((line, idx) => (
                    <EngineLine
                        key={idx}
                        sanMoves={line}
                        evaluation={lineEvaluations[idx]}
                        isMainLine={idx === 0}
                        isLastLine={idx === sanLines.length - 1}
                        onMoveClick={handleMoveClick}
                    />
                ))}

                {sanLines.length === 0 && !isAnalysisOn && (
                    <div className="p-4 text-sm text-slate-400 text-center">
                        Click the toggle to turn on computer analysis.
                    </div>
                )}

                {sanLines.length === 0 && isAnalysisOn && (
                    <div className="p-4 text-sm text-slate-400 text-center">
                        Analyzing position...
                    </div>
                )}
            </div>
        </div>
    );
}