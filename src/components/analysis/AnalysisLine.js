import {useGameStore} from "../../stores/gameStore";
import {Chess} from "chess.js";

export function AnalysisLine({ line, isMainLine, onMoveClick }) {
    const { currentFen } = useGameStore();

    if (!line || !line.moves) return null;

    const chess = new Chess(currentFen);
    const currentMoveNumber = chess.moveNumber();
    const isBlackToMove = chess.turn() === 'b';

    const formatScore = (score) => {
        if (typeof score === 'string') return score;
        return score > 0 ? `+${score.toPrecision(3)}` : score.toPrecision(3);
    };

    const getScoreColor = (score) => {
        if (typeof score === 'string') return 'text-red-400';
        return score > 0.5 ? 'text-emerald-400' :
            score < -0.5 ? 'text-red-400' :
                'text-slate-300';
    };

    // Function to determine move number and notation
    const getMoveNumbering = (idx) => {
        const isFirstMove = idx === 0;

        if (isBlackToMove) {
            // If Black to move, first move is Black's move
            if (isFirstMove) {
                return {
                    number: currentMoveNumber,
                    notation: '..'
                };
            }
            // Subsequent moves start with White's move of next number
            const moveNumber = currentMoveNumber + Math.floor((idx + 1) / 2);
            const isBlackMove = idx % 2 === 0; // Shifted by 1 because first move was Black's
            return {
                number: moveNumber,
                notation: isBlackMove ? '..' : ''
            };
        } else {
            // If White to move, normal numbering
            const moveNumber = currentMoveNumber + Math.floor(idx / 2);
            const isBlackMove = idx % 2 === 1;
            return {
                number: moveNumber,
                notation: isBlackMove ? '..' : ''
            };
        }
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
                        const { number, notation } = getMoveNumbering(idx);
                        const showMoveNumber = notation === '' || idx === 0;

                        return (
                            <button
                                key={idx}
                                onClick={() => onMoveClick(line.moves.slice(0, idx + 1))}
                                className="hover:text-white hover:underline transition-colors flex-none"
                            >
                                {showMoveNumber && (
                                    <span className="text-slate-500 mr-1">
                    {number}.{notation}
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