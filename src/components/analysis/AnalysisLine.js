export function AnalysisLine({ line, isMainLine, onMoveClick }) {
    if (!line || !line.moves) return null;

    const formatScore = (score) => {
        if (typeof score === 'string') return score; // For mate scores
        return score > 0 ? `+${score.toPrecision(3)}` : score.toPrecision(3);
    };

    return (
        <div className="flex p-2 hover:bg-slate-700 transition-colors text-sm">
            {/* Score section */}
            <div className="flex-none w-20">
        <span className={`font-mono ${isMainLine ? "font-bold" : ""} ${
            typeof line.score === 'string' ? 'text-red-400' :
                line.score > 0.5 ? 'text-emerald-400' :
                    line.score < -0.5 ? 'text-red-400' :
                        'text-slate-300'
        }`}>
          {formatScore(line.score)}
        </span>
            </div>

            {/* Moves section with hover-visible scrollbar */}
            <div className="flex-1 overflow-x-auto scrollbar-thin hover:scrollbar-thumb-slate-600 scrollbar-thumb-transparent scrollbar-track-transparent">
                <div className="flex gap-1 text-slate-300 pr-2 whitespace-nowrap">
                    {line.moves.map((move, idx) => (
                        <button
                            key={idx}
                            onClick={() => onMoveClick(line.moves.slice(0, idx + 1))}
                            className="hover:text-white hover:underline transition-colors flex-none"
                        >
                            {idx % 2 === 0 && (
                                <span className="text-slate-500 mr-1">
                  {Math.floor(idx / 2 + 1)}.
                </span>
                            )}
                            {move}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}