import React from 'react';
import {MoveGroup} from './MoveGroup';

export function MoveHistoryList({ moveGroups, currentMoveIndex, goToMove }) {
    return (
        <div className={`bg-slate-800 rounded-b-lg flex-wrap p-2 gap-1 ${moveGroups.length === 0 ? 'hidden' : 'flex'}`}>
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