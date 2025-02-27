import React from "react";
import { useGameStore } from "../../hooks/stores/useGameStore";
import { processEvaluation } from "../../utils/evaluation";

export function EngineLine({ line, isMainLine, onMoveClick }) {
    const { currentMoveIndex } = useGameStore();

    if (!line || !line.moves) return null;

    // Use the centralized evaluation utilities
    const evalDetails = processEvaluation(line.score);

    // Function to determine move number and notation
    const getMoveNumbering = (idx) => {
        // Get current position's turn (based on game move history and current index)
        const isCurrentPositionBlackToMove =
            (currentMoveIndex + 1) % 2 === 1; // +1 because moveIndex is 0-based

        // Calculate the actual move number for this suggestion
        // Current full move number + any additional full moves in the line
        const baseMoveNumber = Math.floor((currentMoveIndex + 1) / 2) + 1;
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
    const evalBgColor = evalDetails.winningColor === "white" || evalDetails.advantage === "equal"
        ? "bg-slate-100 text-slate-900"
        : "bg-slate-900 text-slate-100";

    return (
        <div className="flex items-center hover:bg-slate-700 transition-colors text-sm gap-2">
            <div className={`flex font-mono px-0.5 ${isMainLine ? "font-bold" : ""} ${evalBgColor}`}>
                {evalDetails.formattedScore}
            </div>
            <div className="flex gap-1 text-slate-300 whitespace-nowrap overflow-x-auto scrollbar-none">
                {line.moves.map((move, idx) => {
                    const { number, isBlackMove } = getMoveNumbering(idx);
                    const showMoveNumber = !isBlackMove || idx === 0;

                    return (
                        <button
                            key={idx}
                            onClick={() => onMoveClick(line.moves.slice(0, idx + 1))}
                            className="hover:text-slate-100 hover:underline transition-colors flex-none"
                        >
                            {showMoveNumber && (
                                <span className="text-slate-500 mr-1">
                                    {number}{isBlackMove ? '...' : '.'}
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