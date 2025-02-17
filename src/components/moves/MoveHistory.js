import {useGameStore} from "../../stores/gameStore";
import {MoveHistoryHeader} from "./MoveHistoryHeader";

export function MoveHistory() {
    const { gameMoveHistory, currentMoveIndex, goToMove } = useGameStore();

    // Group moves into pairs (white and black moves)
    const moveGroups = [];
    for (let i = 0; i < gameMoveHistory.length; i += 2) {
        moveGroups.push({
            number: Math.floor(i / 2) + 1,
            white: gameMoveHistory[i],
            black: gameMoveHistory[i + 1],
        });
    }

    return (
        <div className="flex flex-col">
            <MoveHistoryHeader />

            <div className="p-2 flex rounded-b-lg flex-wrap bg-slate-800 gap-1 min-h-[calc(100vh-18rem)] max-h-[calc(100vh-18rem)] overflow-y-auto">
                {moveGroups.map(({ number, white, black }, groupIndex) => (
                    <div key={number} className="flex gap-1 items-center">
                        <span className="text-slate-500 text-sm">{number}.</span>

                        {/* White's move */}
                        <button
                            onClick={() => goToMove(groupIndex * 2)}
                            className={`px-1 rounded text-sm hover:bg-slate-700 transition-colors ${
                                currentMoveIndex === groupIndex * 2
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'text-slate-300'
                            }`}
                        >
                            {white.san}
                        </button>

                        {/* Black's move (if exists) */}
                        {black && (
                            <button
                                onClick={() => goToMove(groupIndex * 2 + 1)}
                                className={`px-1 rounded text-sm hover:bg-slate-700 transition-colors ${
                                    currentMoveIndex === groupIndex * 2 + 1
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'text-slate-300'
                                }`}
                            >
                                {black.san}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}