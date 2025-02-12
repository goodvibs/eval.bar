import {useGameStore} from "../../stores/gameStore";
import {Chess} from "chess.js";

export function AnalysisLine({ line, isMainLine, onMoveClick }) {
    const { currentFen } = useGameStore();

    if (!line || !line.moves) return null;

    // Create a chess instance from current position to get move number and side to move
    const chess = new Chess(currentFen);
    const currentMoveNumber = chess.moveNumber();
    const isBlackToMove = chess.turn() === 'b';

    const formatScore = (score) => {
        if (typeof score === 'string') return score; // For mate scores
        return score > 0 ? `+${score.toPrecision(3)}` : score.toPrecision(3);
    };

    const getScoreColor = (score) => {
        if (typeof score === 'string') return 'text-red-400';
        return score > 0.5 ? 'text-emerald-400' :
            score < -0.5 ? 'text-red-400' :
                'text-slate-300';
    };

    return (
        <div className="flex p-2 hover:bg-slate-700 transition-colors text-sm">
            <div className="flex-none w-20">
        <span className={`font-mono ${isMainLine ? "font-bold" : ""} ${getScoreColor(line.score)}`}>
          {formatScore(line.score)}
        </span>
            </div>
            <div className="flex-1 overflow-x-auto scrollbar-thin hover:scrollbar-thumb-slate-600 scrollbar-thumb-transparent scrollbar-track-transparent">
                <div className="flex gap-1 text-slate-300 pr-2 whitespace-nowrap">
                    {line.moves.map((move, idx) => {
                        // Calculate if we need to show the move number
                        const moveNumber = currentMoveNumber + Math.floor(idx / 2);
                        const isFirstMove = idx === 0;
                        const isBlackMove = (isBlackToMove && isFirstMove) || (!isFirstMove && idx % 2 === 1);
                        const showMoveNumber = !isBlackMove || isFirstMove;

                        return (
                            <button
                                key={idx}
                                onClick={() => onMoveClick(line.moves.slice(0, idx + 1))}
                                className="hover:text-white hover:underline transition-colors flex-none"
                            >
                                {showMoveNumber && (
                                    <span className="text-slate-500 mr-1">
                    {moveNumber}.{isBlackMove ? '..' : ''}
                  </span>
                                )}
                                {move}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}