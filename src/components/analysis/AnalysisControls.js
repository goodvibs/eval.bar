import {useEngineStore} from "../../stores/useEngineStore";

export function AnalysisControls() {
    const {
        isAnalyzing,
        startAnalysis,
        stopAnalysis,
        multipv,
        setMultiPV,
        depth
    } = useEngineStore();

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={isAnalyzing ? stopAnalysis : startAnalysis}
                className={`px-3 py-1 rounded text-sm ${
                    isAnalyzing ?
                        'bg-red-600 hover:bg-red-700' :
                        'bg-green-600 hover:bg-green-700'
                } text-white transition-colors`}
            >
                {isAnalyzing ? 'Stop' : 'Analyze'}
            </button>

            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">Lines:</span>
                <select
                    value={multipv}
                    onChange={(e) => setMultiPV(parseInt(e.target.value))}
                    className="bg-slate-600 text-slate-200 rounded px-2 py-1 text-sm"
                    disabled={isAnalyzing}
                >
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
            </div>

            {depth > 0 && (
                <span className="text-sm text-slate-400">
          Depth: {depth}
        </span>
            )}
        </div>
    );
}