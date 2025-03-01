import React from "react";
import { EngineLine } from "./EngineLine";
import { useGameStore } from "../../hooks/stores/useGameStore";
import { useEngineStore } from "../../hooks/stores/useEngineStore";
import { AnalysisPanelHeader } from "./AnalysisPanelHeader";

export function AnalysisPanel() {
    const {
        currentLines,
        isAnalyzing,
        currentSearchDepth,
        engineReady,
        startAnalysis,
        stopAnalysis
    } = useEngineStore();

    const { makeMove } = useGameStore();

    const handleMoveClick = (sanMoves) => {
        for (let i = 0; i < sanMoves.length; i++) {
            console.assert(makeMove(sanMoves[i]), `Failed to make move: ${sanMoves[i]}`);
        }
    };

    const handleAnalysisToggle = () => {
        if (isAnalyzing) {
            stopAnalysis();
        } else {
            startAnalysis();
        }
    };

    return (
        <div className="flex min-h-fit flex-col bg-slate-800 rounded-lg">
            <AnalysisPanelHeader
                isAnalyzing={isAnalyzing}
                depth={currentSearchDepth}
                currentLines={currentLines}
                onAnalysisToggle={handleAnalysisToggle}
                engineReady={engineReady}
            />

            <div className="flex flex-1 flex-col divide-y divide-slate-700">
                {currentLines.map((line, idx) => (
                    <EngineLine
                        key={idx}
                        line={line}
                        isMainLine={idx === 0}
                        isLastLine={idx === currentLines.length - 1}
                        onMoveClick={handleMoveClick}
                    />
                ))}

                {currentLines.length === 0 && !isAnalyzing && (
                    <div className="p-4 text-sm text-slate-400 text-center">
                        Click the toggle to turn on computer analysis.
                    </div>
                )}

                {currentLines.length === 0 && isAnalyzing && (
                    <div className="p-4 text-sm text-slate-400 text-center">
                        Analyzing position...
                    </div>
                )}
            </div>
        </div>
    );
}