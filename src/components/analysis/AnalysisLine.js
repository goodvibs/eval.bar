import React, { useMemo } from "react";
import { useGameStore } from "../../stores/gameStore";
import { Chess } from "chess.js";

export function AnalysisLine({ line, isMainLine, onMoveClick }) {
    const { currentPositionFen } = useGameStore();

    // Use useMemo to avoid recalculating these on every render
    const { moveNumber, isBlackToMove } = useMemo(() => {
        const chess = new Chess(currentPositionFen);
        return {
            moveNumber: Math.floor(chess.history().length / 2) + 1,
            isBlackToMove: chess.turn() === 'b'
        };
    }, [currentPositionFen]);

    if (!line || !line.moves) return null;

    const formatScore = (score) => {
        if (typeof score === 'string') return score;
        return score > 0 ? `+${score.toPrecision(3)}` : score.toPrecision(3);
    };

    // Function to determine move number and notation
    const getMoveNumbering = (idx) => {
        const isFirstMove = idx === 0;

        if (isBlackToMove) {
            // If Black to move, first move is Black's move
            if (isFirstMove) {
                return {
                    number: moveNumber,
                    notation: '..'
                };
            }
            // Subsequent moves start with White's move of next number
            const moveNumber_ = moveNumber + Math.floor((idx + 1) / 2);
            const isBlackMove = idx % 2 === 0; // Shifted by 1 because first move was Black's
            return {
                number: moveNumber_,
                notation: isBlackMove ? '..' : ''
            };
        } else {
            // If White to move, normal numbering
            const moveNumber_ = moveNumber + Math.floor(idx / 2);
            const isBlackMove = idx % 2 === 1;
            return {
                number: moveNumber_,
                notation: isBlackMove ? '..' : ''
            };
        }
    };

    // Determine if white is winning based on the score
    const isWhiteWinning = typeof line.score === 'string'
        ? line.score.startsWith('M')
        : line.score >= 0;

    return (
        <div className="flex items-center hover:bg-slate-700 transition-colors text-sm gap-2">
            <div className={`flex font-mono px-0.5 ${isMainLine ? "font-bold" : ""} ${isWhiteWinning ? "bg-slate-100 text-slate-900" : "bg-slate-900 text-slate-100"}`}>
              {formatScore(line.score)}
            </div>
            <div className="flex gap-1 text-slate-300 whitespace-nowrap overflow-x-auto scrollbar-none">
                {line.moves.map((move, idx) => {
                    const { number, notation } = getMoveNumbering(idx);
                    const showMoveNumber = notation === '' || idx === 0;

                    return (
                        <button
                            key={idx}
                            onClick={() => onMoveClick(line.moves.slice(0, idx + 1))}
                            className="hover:text-slate-100 hover:underline transition-colors flex-none"
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
    );
}