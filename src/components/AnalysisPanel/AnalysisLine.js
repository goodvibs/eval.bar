export function AnalysisLine({ evaluation, depth, moves, isMainLine = false }) {
    // Format evaluation for display
    const formatEval = (eval_) => {
        if (eval_ === 0) return "0.0";
        return eval_ > 0 ? `+${eval_.toFixed(1)}` : eval_.toFixed(1);
    };

    return (
        <div className="flex p-2 hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2 min-w-24">
        <span className={`font-mono text-lg ${isMainLine ? "font-bold" : ""} ${
            evaluation > 0 ? "text-emerald-400" :
                evaluation < 0 ? "text-red-400" :
                    "text-slate-300"
        }`}>
          {formatEval(evaluation)}
        </span>
            </div>
            <div className="flex flex-wrap gap-2 text-slate-300">
                {moves.map((move, idx) => (
                    <span
                        key={idx}
                        className="hover:text-white cursor-pointer transition-colors"
                    >
            {idx % 2 === 0 && (
                <span className="text-slate-500 mr-1">
                {Math.floor(idx / 2 + 1)}.
              </span>
            )}
                        {move}
          </span>
                ))}
            </div>
        </div>
    );
}