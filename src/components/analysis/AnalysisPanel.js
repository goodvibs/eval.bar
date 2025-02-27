import React from "react";
import { EngineLine } from "./EngineLine";
import { useGameStore } from "../../hooks/stores/useGameStore";
import { Chess } from "cm-chess";
import { useEngineStore } from "../../hooks/stores/useEngineStore";
import { useStockfish } from "../../hooks/useStockfish";
import { usePositionSync } from "../../hooks/usePositionSync";
import { AnalysisPanelHeader } from "./AnalysisPanelHeader";

export function AnalysisPanel() {
    const {
        currentLines,
        isAnalyzing,
        depth,
        engineThinking,
        engineReady,
        startAnalysis,
        stopAnalysis
    } = useEngineStore();

    const { loadPosition } = useGameStore();

    // Simply initialize Stockfish - all control now happens through the store
    useStockfish();

    // Keep position syncing
    usePositionSync();

    const handleMoveClick = (moves) => {
        const game = new Chess();
        moves.forEach(move => game.move(move));
        loadPosition(game.fen());
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
                depth={depth}
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
                        onMoveClick={handleMoveClick}
                    />
                ))}

                {currentLines.length === 0 && !isAnalyzing && (
                    <div className="p-4 text-sm text-slate-400 text-center">
                        Click "Analyze" to evaluate this position
                    </div>
                )}

                {currentLines.length === 0 && isAnalyzing && (
                    <div className="p-4 text-sm text-slate-400 text-center">
                        Analyzing position...
                    </div>
                )}
            </div>

            {isAnalyzing && engineThinking && (
                <div className="p-2 text-xs font-mono text-slate-400 overflow-x-auto scrollbar-none border-t border-slate-700 whitespace-nowrap">
                    {engineThinking}
                </div>
            )}
        </div>
    );
}