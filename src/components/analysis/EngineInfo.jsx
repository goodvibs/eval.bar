// Updated EngineInfo component
import {
    useCurrentSearchDepth,
    useIsAnalysisOn,
    useIsEngineReady
} from "../../hooks/stores/useEngineStore";

export function EngineInfo() {
    const isAnalysisOn = useIsAnalysisOn();
    const currentSearchDepth = useCurrentSearchDepth();
    const isEngineReady = useIsEngineReady();

    return (
        <div className="flex flex-1 flex-col min-w-fit">
            <div className="flex flex-nowrap items-center gap-1">
                <span className="font-medium text-slate-300 flex text-sm text-nowrap">Stockfish 16</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
                {!isEngineReady
                    ? 'Loading...'
                    : isAnalysisOn
                        ? `Depth ${currentSearchDepth}`
                        : 'Ready'
                }
            </span>
        </div>
    );
}