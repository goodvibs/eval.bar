export function AnalysisLine({ line, isMainLine, onMoveClick }) {
    const formatScore = (score) => {
        if (typeof score === 'string' && score.startsWith('M')) {
            return score; // Already formatted mate score
        }
        return score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);
    };

    const getScoreColor = (score) => {
        if (typeof score === 'string' && score.startsWith('M')) {
            return 'text-red-400';
        }
        return score > 0.5 ? 'text-emerald-400' :
            score < -0.5 ? 'text-red-400' :
                'text-slate-300';
    };

    if (!line || !line.moves) return null;

    return (
        <div className="flex p-2 hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2 min-w-24">
        <span className={`font-mono text-lg ${isMainLine ? "font-bold" : ""} ${getScoreColor(line.score)}`}>
          {formatScore(line.score)}
        </span>
            </div>
            <div className="flex flex-wrap gap-2 text-slate-300">
                {line.moves.map((move, idx) => (
                    <button
                        key={idx}
                        onClick={() => onMoveClick(line.moves.slice(0, idx + 1))}
                        className="hover:text-white hover:underline transition-colors"
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
    );
}