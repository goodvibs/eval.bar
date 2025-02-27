// Updated EngineInfo component
export function EngineInfo({ isAnalyzing, depth, engineReady }) {
    return (
        <div className="flex flex-col min-w-fit">
            <span className="text-xs font-medium text-slate-300 flex text-nowrap">Stockfish 16</span>
            <span className="text-xs text-slate-400">
                {!engineReady
                    ? 'Loading...'
                    : isAnalyzing
                        ? `Depth ${depth}`
                        : 'Ready'
                }
            </span>
        </div>
    );
}