import {useGameStore} from "../../hooks/stores/useGameStore";
import {MoveHistoryHeader} from "./MoveHistoryHeader";
import {MoveHistoryList} from "./MoveHistoryList";

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
    const { pgn, getCurrentHalfmoveCount, goToMove } = useGameStore();

    // Group moves into pairs using the utility function
    const moveGroups = groupMovesIntoPairs(pgn.history.moves);

    return (
        <div className="flex flex-col rounded-lg overflow-hidden">
            <MoveHistoryHeader />
            <div className="bg-slate-800 rounded-b-lg overflow-y-auto max-h-40">
                <MoveHistoryList
                    moveGroups={moveGroups}
                    currentMoveIndex={getCurrentHalfmoveCount() - 1}
                    goToMove={goToMove}
                />
            </div>
        </div>
    );
}