import React from "react";
import { useGameStore } from "../../hooks/stores/useGameStore";

export function EngineLine({ sanMoves, evaluation, isMainLine, isLastLine, onMoveClick }) {
    const { game, getCurrentFullmove } = useGameStore();
    const baseMoveNumber = getCurrentFullmove();

    const isCurrentPositionBlackToMove = game.turn() === 'b';

    // Function to determine move number and notation
    const getMoveNumbering = (idx) => {
        const offsetInLine = Math.floor((idx + (isCurrentPositionBlackToMove ? 1 : 0)) / 2);
        const moveNumber = baseMoveNumber + offsetInLine;

        // Determine if this particular move is by black
        const isBlackMove = (isCurrentPositionBlackToMove && idx % 2 === 0) ||
            (!isCurrentPositionBlackToMove && idx % 2 === 1);

        return {
            number: moveNumber,
            isBlackMove: isBlackMove
        };
    };

    // Determine background color based on winning color using our utility
    const evalBgColor = evaluation.advantage === 'equal' ? "bg-slate-500 text-slate-100" : (
        evaluation.advantage === 'white'
        ? "bg-slate-100 text-slate-900"
        : "bg-slate-900 text-slate-100"
    );

    return (
        <div className="flex items-center hover:bg-slate-700 transition-colors text-sm gap-2">
            <div className={`flex flex-nowrap text-nowrap font-mono px-0.5 rounded-r-3xl ${isMainLine ? "font-bold" : ""} ${isLastLine ? "rounded-bl-lg" : ""} ${evalBgColor}`}>
                {evaluation.formattedEvaluation}
            </div>
            <div className="flex gap-1 text-slate-300 whitespace-nowrap overflow-x-auto scrollbar-none">
                {sanMoves.map((san, idx) => {
                    const { number, isBlackMove } = getMoveNumbering(idx);
                    const showMoveNumber = !isBlackMove || idx === 0;

                    return (
                        <button
                            key={idx}
                            onClick={() => onMoveClick(sanMoves.slice(0, idx + 1))}
                            className="hover:text-slate-100 hover:underline transition-colors flex-none"
                        >
                            {showMoveNumber && (
                                <span className="text-slate-500 mr-1">
                                    {number}{isBlackMove ? '...' : '.'}
                                </span>
                            )}
                            {san}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}