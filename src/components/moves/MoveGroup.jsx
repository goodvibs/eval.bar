import React from 'react';
import {MoveButton} from './MoveButton';

export function MoveGroup({ number, white, black, groupIndex, currentMoveIndex, goToMove }) {
    return (
        <div className="flex gap-1 items-center">
            <span className="text-slate-500 text-normal">{number}.</span>

            {/* White's move */}
            <MoveButton
                move={white}
                moveIndex={groupIndex * 2}
                isSelected={currentMoveIndex === groupIndex * 2}
                onMoveClick={goToMove}
            />

            {/* Black's move (if exists) */}
            {black && (
                <MoveButton
                    move={black}
                    moveIndex={groupIndex * 2 + 1}
                    isSelected={currentMoveIndex === groupIndex * 2 + 1}
                    onMoveClick={goToMove}
                />
            )}
        </div>
    );
}