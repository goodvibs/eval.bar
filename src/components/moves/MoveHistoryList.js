import React from 'react';
import {MoveGroup} from './MoveGroup';

export function MoveHistoryList({ moveGroups, currentMoveIndex, goToMove }) {
    return (
        <div className="p-2 flex flex-wrap gap-1 max-h-[calc(100vh-18rem)] overflow-y-auto">
            {moveGroups.map(({ number, white, black }, groupIndex) => (
                <MoveGroup
                    key={number}
                    number={number}
                    white={white}
                    black={black}
                    groupIndex={groupIndex}
                    currentMoveIndex={currentMoveIndex}
                    goToMove={goToMove}
                />
            ))}
        </div>
    );
}