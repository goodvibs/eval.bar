import {useGameStore} from "../stores/gameStore";

export function MoveHistory() {
    const { moveHistory, currentMoveIndex, goToMove } = useGameStore();

    // Group moves into pairs (white and black moves)
    const moveGroups = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
        moveGroups.push({
            number: Math.floor(i / 2) + 1,
            white: moveHistory[i],
            black: moveHistory[i + 1],
        });
    }

    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="p-2 bg-slate-700 border-b border-slate-600">
                <h3 className="text-sm font-medium text-slate-300">Moves</h3>
            </div>

            <div className="p-2 flex flex-wrap gap-1 max-h-[200px] overflow-y-auto scrollbar-thin hover:scrollbar-thumb-slate-600 scrollbar-thumb-transparent scrollbar-track-transparent">
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