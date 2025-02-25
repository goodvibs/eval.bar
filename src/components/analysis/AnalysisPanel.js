import React, { useEffect } from "react";
import { AnalysisLine } from "./AnalysisLine";
import { useGameStore } from "../../stores/gameStore";
import { Chess } from "chess.js";
import { useEngineStore } from "../../stores/useEngineStore";
import { useStockfish } from "../../hooks/useStockfish";
import { usePositionSync } from "../../hooks/usePositionSync";
import { AnalysisPanelHeader } from "./AnalysisPanelHeader";

export function AnalysisPanel() {
    const {
        currentLines,
        isAnalyzing,
        depth,
        engineThinking,
    } = useEngineStore();

    const { loadPosition } = useGameStore();

    // Use the improved Stockfish hook with access to its methods
    const { sendCommand, isReady, resetEngine } = useStockfish({ multiPV: useEngineStore.getState().multipv });

    // Connect the Stockfish hook to the engine store
    useEffect(() => {
        if (isReady) {
            // Override the engine store methods to use the hook's methods
            const originalStartAnalysis = useEngineStore.getState().startAnalysis;
            const originalStopAnalysis = useEngineStore.getState().stopAnalysis;
            const originalUpdatePosition = useEngineStore.getState().updatePosition;

            useEngineStore.setState({
                startAnalysis: () => {
                    const { multipv, searchDepth } = useEngineStore.getState();
                    originalStartAnalysis();

                    sendCommand('setoption name MultiPV value ' + multipv);
                    sendCommand('position fen ' + useGameStore.getState().currentPositionFen);
                    sendCommand(`go depth ${searchDepth}`);
                },

                stopAnalysis: () => {
                    originalStopAnalysis();
                    sendCommand('stop');
                },

                updatePosition: (fen) => {
                    originalUpdatePosition(fen);

                    if (useEngineStore.getState().isAnalyzing) {
                        sendCommand('stop');
                        sendCommand('position fen ' + fen);
                        sendCommand(`go depth ${useEngineStore.getState().searchDepth}`);
                    }
                },

                resetEngine: () => {
                    resetEngine();
                    sendCommand('ucinewgame');
                }
            });
        }
    }, [sendCommand, isReady, resetEngine]);

    usePositionSync();

    const handleMoveClick = (moves) => {
        const game = new Chess();
        moves.forEach(move => game.move(move));
        loadPosition(game.fen());
    };

    return (
        <div className="flex min-h-fit flex-col bg-slate-800 rounded-lg">
            <AnalysisPanelHeader
                isAnalyzing={isAnalyzing}
                depth={depth}
                currentLines={currentLines}
            />

            <div className="flex flex-1 flex-col divide-y divide-slate-700">
                {currentLines.map((line, idx) => (
                    <AnalysisLine
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