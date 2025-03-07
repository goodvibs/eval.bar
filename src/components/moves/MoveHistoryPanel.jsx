import {useGameActions, useGameDerivedState, usePgnDerivedState} from "../../hooks/stores/useGameStore";
import {MoveHistoryHeader} from "./MoveHistoryHeader";
import {MoveHistoryList} from "./MoveHistoryList";
import React from "react";

function groupMovesIntoPairs(moveHistory) {
    const moveGroups = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
        moveGroups.push({
            number: Math.floor(i / 2) + 1,
            white: moveHistory[i],
            black: moveHistory[i + 1],
        });
    }
    return moveGroups;
}

export function MoveHistoryPanel() {
    const { goToMove } = useGameActions();
    const { halfmoveCount } = useGameDerivedState();
    const { moves } = usePgnDerivedState();

    // Group moves into pairs using the utility function
    const moveGroups = groupMovesIntoPairs(moves);

    return (
        <div className="flex flex-col rounded-lg">
            <MoveHistoryHeader />
            {moveGroups.length === 0 && (
                <div className="p-4 bg-slate-800 text-normal text-slate-400 text-center rounded-b-lg">
                    Play a move or import a game to see your move history here.
                </div>
            )}
            <MoveHistoryList
                moveGroups={moveGroups}
                currentMoveIndex={halfmoveCount - 1}
                goToMove={goToMove}
            />
        </div>
    );
}