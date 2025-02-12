import React from "react";
import {useGameStore} from "../../stores/gameStore";

function MovePair({ moveNumber, whiteMove, blackMove, currentMoveIndex, onMoveClick }) {
    const whiteMoveIndex = (moveNumber - 1) * 2;
    const blackMoveIndex = whiteMoveIndex + 1;

    return (
        <div className="flex text-sm">
            {/* Move number */}
            <div className="flex-none w-8 text-slate-500 py-1 px-2">
                {moveNumber}.
            </div>

            {/* White's move */}
            <button
                onClick={() => onMoveClick(whiteMoveIndex)}
                className={`flex-1 text-left px-2 py-1 hover:bg-slate-700 transition-colors
          ${currentMoveIndex === whiteMoveIndex ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-slate-300'}`}
            >
                {whiteMove?.san}
            </button>

            {/* Black's move */}
            {blackMove && (
                <button
                    onClick={() => onMoveClick(blackMoveIndex)}
                    className={`flex-1 text-left px-2 py-1 hover:bg-slate-700 transition-colors
            ${currentMoveIndex === blackMoveIndex ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-slate-300'}`}
                >
                    {blackMove.san}
                </button>
            )}
        </div>
    );
}

export function MoveHistoryPanel() {
    const {
        moveHistory,
        currentMoveIndex,
        goToMove
    } = useGameStore();

    // Group moves into pairs
    const movePairs = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
        movePairs.push({
            moveNumber: Math.floor(i / 2) + 1,
            whiteMove: moveHistory[i],
            blackMove: moveHistory[i + 1]
        });
    }

    return (
        <div className="flex flex-col bg-slate-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-2 bg-slate-700 border-b border-slate-600">
                <h3 className="text-sm font-medium text-slate-300">Moves</h3>
            </div>

            {/* Move list */}
            <div className="flex flex-col overflow-y-auto max-h-[300px] scrollbar-thin hover:scrollbar-thumb-slate-600 scrollbar-thumb-transparent scrollbar-track-transparent">
                {movePairs.map(({ moveNumber, whiteMove, blackMove }) => (
                    <MovePair
                        key={moveNumber}
                        moveNumber={moveNumber}
                        whiteMove={whiteMove}
                        blackMove={blackMove}
                        currentMoveIndex={currentMoveIndex}
                        onMoveClick={goToMove}
                    />
                ))}
            </div>
        </div>
    );
}