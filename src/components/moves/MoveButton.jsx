import React from 'react';

export function MoveButton({ move, moveIndex, isSelected, onMoveClick }) {
    return (
        <button
            onClick={() => onMoveClick(moveIndex)}
            className={`px-1 rounded text-sm hover:bg-slate-700 transition-colors ${
                isSelected
                    ? 'bg-blue-500 hover:bg-blue-600 text-slate-100'
                    : 'text-slate-300'
            }`}
        >
            {move.san}
        </button>
    );
}