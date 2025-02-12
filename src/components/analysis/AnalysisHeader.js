export function AnalysisHeader({ depth, isAnalyzing }) {
    return (
        <div className="flex items-center justify-between p-2 bg-slate-800 border-b border-slate-600">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Stockfish 16</span>
                <span className="text-sm text-slate-300">
          {isAnalyzing ? `Analyzing... Depth ${depth}` : `Depth ${depth}`}
        </span>
            </div>
            <button className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                {isAnalyzing ? "Stop" : "Start"}
            </button>
        </div>
    );
}