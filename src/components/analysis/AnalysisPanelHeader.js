import {useEngineStore} from "../../stores/useEngineStore";

export function AnalysisPanelHeader({ isAnalyzing, depth, currentLines }) {
    const { startAnalysis, stopAnalysis, multipv, setMultiPV } = useEngineStore();
    const mainLine = currentLines[0];
    const eval_ = mainLine?.score ?? 0;

    const formatEval = (eval_) => {
        if (typeof eval_ === 'string') return eval_; // For mate scores
        return eval_ > 0 ? `+${eval_.toPrecision(3)}` : eval_.toPrecision(3);
    };

    const handleAnalysisClick = () => {
        if (isAnalyzing) {
            stopAnalysis();
        } else {
            startAnalysis();
        }
    };

    let isWhiteWinning = eval_ >= 0;

    return (
        <div className="px-3 py-2 bg-slate-700 border-b border-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Evaluation display */}
                <div className="flex items-center gap-2">
          <span className={"font-mono text-lg font-bold " + isWhiteWinning ? "bg-slate-50 text-slate-900" : "bg-slate-900 text-slate-50"}>
            {formatEval(eval_)}
          </span>
                </div>

                {/* Engine info */}
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-300">Stockfish 16</span>
                    <span className="text-xs text-slate-400">
            {isAnalyzing ? `Analyzing depth ${depth}` : 'Ready'}
          </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                <select
                    className="bg-slate-600 text-slate-200 text-sm rounded px-2 py-1 border border-slate-500 disabled:opacity-50"
                    value={multipv}
                    onChange={(e) => setMultiPV(Number(e.target.value))}
                    disabled={isAnalyzing}
                >
                    <option value={1}>1 line</option>
                    <option value={2}>2 lines</option>
                    <option value={3}>3 lines</option>
                    <option value={4}>4 lines</option>
                    <option value={5}>5 lines</option>
                </select>

                <button
                    onClick={handleAnalysisClick}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                        isAnalyzing
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-500 text-white'
                    }`}
                >
                    {isAnalyzing ? 'Stop' : 'Analyze'}
                </button>
            </div>
        </div>
    );
}