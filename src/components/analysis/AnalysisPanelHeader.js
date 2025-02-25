import {useEngineStore} from "../../stores/useEngineStore";
import React from "react";

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
        <div className="bg-slate-700 border-b gap-4 border-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Evaluation display */}
                <div className={`flex font-mono p-2 text-lg font-bold ${isWhiteWinning ? "bg-slate-100 text-slate-900" : "bg-slate-900 text-slate-50"}`}>
                    {formatEval(eval_)}
                </div>

                {/* Engine info */}
                <div className="flex flex-col min-w-fit">
                    <span className="text-xs font-medium text-slate-300 flex text-nowrap">Stockfish 16</span>
                    <span className="text-xs text-slate-400">
                        {isAnalyzing ? `Depth ${depth}` : 'Ready'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 px-2">
                <select
                    className="hidden bg-slate-600 text-slate-200 text-sm rounded px-2 py-1 border border-slate-500 disabled:opacity-50"
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
                    className={`flex flex-nowrap items-center px-2 py-1 text-sm rounded transition-all gap-1 font-semibold ${
                        isAnalyzing
                            ? 'bg-red-600 hover:bg-red-700 text-slate-100'
                            : 'bg-green-600 hover:bg-green-500 text-slate-100'
                    }`}
                >
                    {
                        isAnalyzing ?
                            <svg
                                className="w-4 h-4 text-slate-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg> :
                            <svg className="fill-slate-100" xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 -960 960 960">
                                <path d="M440-240q116 0 198-81.5T720-520q0-116-82-198t-198-82q-117 0-198.5 82T160-520q0 117 81.5 198.5T440-240Zm0-280Zm0 160q-72 0-133.5-38.5T210-501q-5-9-5-19t5-19q35-64 96.5-102.5T440-680q72 0 133 39t96 102q5 9 5 19t-5 19q-35 64-96 102.5T440-360Zm0-60q55 0 101-26.5t72-73.5q-26-46-72-73t-101-27q-56 0-102 27t-72 73q26 47 72 73.5T440-420Zm0-40q25 0 42.5-17t17.5-43q0-25-17.5-42.5T440-580q-26 0-43 17.5T380-520q0 26 17 43t43 17Zm0 300q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T80-520q0-74 28.5-139.5t77-114.5q48.5-49 114-77.5T440-880q74 0 139.5 28.5T694-774q49 49 77.5 114.5T800-520q0 64-21 121t-58 104l131 131q12 12 11.5 28T851-108q-12 11-28 11t-28-11L664-238q-47 37-104 57.5T440-160Z"/>
                            </svg>
                    }
                    {isAnalyzing ? 'Stop' : 'Analyze'}
                </button>
            </div>
        </div>
    );
}