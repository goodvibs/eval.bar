import {AnalysisHeader} from "./AnalysisHeader";
import {AnalysisLine} from "./AnalysisLine";
import {useGameStore} from "../../stores/gameStore";
import {AnalysisControls} from "./AnalysisControls";
import {Chess} from "chess.js";
import {useEngineStore} from "../../stores/useEngineStore";
import {useStockfish} from "../../hooks/useStockfish";

export function AnalysisPanel() {
    const { currentLines, isAnalyzing, depth, engineThinking } = useEngineStore();
    const { loadPosition } = useGameStore();

    // Debug rendering
    console.log('Rendering AnalysisPanel with lines:', currentLines);

    useStockfish();

    const handleMoveClick = (moves) => {
        const game = new Chess();
        moves.forEach(move => game.move(move));
        loadPosition(game.fen());
    };

    return (
        <div className="flex flex-col flex-1 bg-slate-800 rounded-lg overflow-hidden">
            <div className="p-2 bg-slate-700 border-b border-slate-600 flex justify-between items-center">
                <div className="text-sm text-slate-300">
                    {isAnalyzing ? `Analyzing... Depth ${depth}` : 'Ready'}
                </div>
                <div className="flex gap-2">
                    <AnalysisControls />
                </div>
            </div>

            <div className="flex flex-col divide-y divide-slate-700">
                {currentLines.map((line, idx) => {
                    console.log('Rendering line:', line);
                    return (
                        <AnalysisLine
                            key={idx}
                            line={line}
                            isMainLine={idx === 0}
                            onMoveClick={handleMoveClick}
                        />
                    );
                })}
            </div>

            {isAnalyzing && engineThinking && (
                <div className="p-2 text-xs font-mono text-slate-400 border-t border-slate-700">
                    {engineThinking}
                </div>
            )}
        </div>
    );
}