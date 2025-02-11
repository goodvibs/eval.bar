import {useGameStore} from "../stores/gameStore";

function MoveTree({ move, currentIndex, onSelect }) {
    if (!move) return null;

    return (
        <span
            onClick={() => onSelect(move.index)}
            className={`
        inline-flex items-center gap-1 cursor-pointer px-1 rounded
        ${move.index === currentIndex ? 'bg-blue-500 text-white' : 'hover:bg-slate-700'}
      `}
        >
      {move.moveNumber && (
          <span className="text-slate-500">{move.moveNumber}.</span>
      )}
            <span>{move.san}</span>

            {move.variations && move.variations.map((variation, idx) => (
                <span key={idx} className="text-slate-500">
          ({variation.moves.map((m, i) => (
                    <span key={i}>
              {i === 0 && m.moveNumber && `${m.moveNumber}...`}
                        {m.san}{' '}
            </span>
                ))})
        </span>
            ))}
    </span>
    );
}

export function MoveHistory() {
    const { moveHistory, currentMoveIndex, goToMove } = useGameStore();

    // Group moves into pairs for proper move numbering
    const moves = moveHistory.map((move, index) => ({
        ...move,
        index,
        moveNumber: index % 2 === 0 ? Math.floor(index / 2) + 1 : null,
    }));

    return (
        <div className="flex flex-col bg-slate-800 rounded-lg overflow-hidden">
            <div className="p-2 bg-slate-700 border-b border-slate-600">
                <h3 className="text-sm font-medium text-slate-300">Moves</h3>
            </div>

            <div className="p-2 flex flex-wrap gap-1 text-slate-300">
                {moves.map((move) => (
                    <MoveTree
                        key={move.index}
                        move={move}
                        currentIndex={currentMoveIndex}
                        onSelect={goToMove}
                    />
                ))}
            </div>
        </div>
    );
}