import {AnalysisLine} from "./AnalysisLine";
import {useGameStore} from "../../stores/gameStore";
import {Chess} from "chess.js";
import {useEngineStore} from "../../stores/useEngineStore";
import {useStockfish} from "../../hooks/useStockfish";
import {usePositionSync} from "../../hooks/usePositionSync";
import {AnalysisPanelHeader} from "./AnalysisPanelHeader";

export function AnalysisPanel() {
    const {
        currentLines,
        isAnalyzing,
        depth,
        engineThinking,
    } = useEngineStore();

    const { loadPosition } = useGameStore();

    useStockfish();
    usePositionSync();

    const handleMoveClick = (moves) => {
        const game = new Chess();
        moves.forEach(move => game.move(move));
        loadPosition(game.fen());
    };

    return (
        <div className="flex min-h-fit flex-col bg-slate-800 rounded-l-lg overflow-hidden">
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
            </div>

            {isAnalyzing && engineThinking && (
                <div className="p-2 text-xs font-mono text-slate-400 overflow-x-auto scrollbar-none border-t border-slate-700 whitespace-nowrap">
                    {engineThinking}
                </div>
            )}
        </div>
    );
}