// Updated EngineInfo component
export function EngineInfo({ isAnalyzing, depth, engineReady }) {
    return (
        <div className="flex flex-col min-w-fit text-xs">
            <div className="flex flex-nowrap items-center gap-1">
                <span className="font-medium text-slate-300 flex text-nowrap">Engine</span>
                <span className="font-medium text-slate-300 flex text-nowrap">(Stockfish 16)</span>
            </div>
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