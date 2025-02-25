import React, { useEffect } from "react";
import { EngineLine } from "./EngineLine";
import { useGameStore } from "../../stores/gameStore";
import { Chess } from "chess.js";
import { engineStore } from "../../stores/engineStore";
import { useStockfish } from "../../hooks/useStockfish";
import { usePositionSync } from "../../hooks/usePositionSync";
import { AnalysisPanelHeader } from "./AnalysisPanelHeader";

export function AnalysisPanel() {
    const {
        currentLines,
        isAnalyzing,
        depth,
        engineThinking,
    } = engineStore();

    const { loadPosition } = useGameStore();

    // Use the improved Stockfish hook with access to its methods
    const { sendCommand, isReady, resetEngine } = useStockfish({ multiPV: engineStore.getState().multipv });

    // Connect the Stockfish hook to the engine store
    useEffect(() => {
        if (isReady) {
            // Override the engine store methods to use the hook's methods
            const originalStartAnalysis = engineStore.getState().startAnalysis;
            const originalStopAnalysis = engineStore.getState().stopAnalysis;
            const originalUpdatePosition = engineStore.getState().updatePosition;

            engineStore.setState({
                startAnalysis: () => {
                    const { multipv, searchDepth } = engineStore.getState();
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

                    if (engineStore.getState().isAnalyzing) {
                        sendCommand('stop');
                        sendCommand('position fen ' + fen);
                        sendCommand(`go depth ${engineStore.getState().searchDepth}`);
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