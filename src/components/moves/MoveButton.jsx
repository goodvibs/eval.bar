import React, { forwardRef } from 'react';

export const MoveButton = forwardRef(function MoveButton(
    { move, moveIndex, isSelected, onMoveClick },
    ref
) {
    return (
        <button
            ref={ref}
            onClick={() => onMoveClick(moveIndex)}
            className={`px-1 rounded-lg text-lg font-mono hover:bg-slate-700 transition-colors ${
                isSelected ? 'bg-blue-500 hover:bg-blue-600 text-slate-100' : 'text-slate-300'
            }`}
        >
            {move.san}
        </button>
    );
});
