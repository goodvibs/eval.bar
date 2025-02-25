import React, { useState, useRef, useEffect } from "react";
import { engineStore } from "../../stores/engineStore";
import { processEvaluation } from "../../utils/evaluation";

export function AnalysisPanelHeader({ isAnalyzing, depth, currentLines }) {
    const { startAnalysis, stopAnalysis, multipv, setMultiPV, searchDepth, setSearchDepth } = engineStore();
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef(null);
    const buttonRef = useRef(null);

    const mainLine = currentLines[0];
    const rawEval = mainLine?.score ?? 0;

    // Use our utility function to get consistent formatting
    const evalDetails = processEvaluation(rawEval);

    const handleAnalysisClick = () => {
        if (isAnalyzing) {
            stopAnalysis();
        } else {
            startAnalysis();
        }
    };

    // Close settings menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowSettings(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Determine background color based on winning color
    const evalBgColor = evalDetails.winningColor === "white" || evalDetails.advantage === "equal"
        ? "bg-slate-100 text-slate-900"
        : "bg-slate-900 text-slate-100";

    return (
        <div className="bg-slate-700 border-b gap-4 border-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Evaluation display */}
                <div className={`flex font-mono p-2 text-lg font-bold rounded-tl-lg ${evalBgColor}`}>
                    {evalDetails.formattedScore}
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
                {/* Settings button */}
                <div className="relative">
                    <button
                        ref={buttonRef}
                        onClick={() => setShowSettings(!showSettings)}
                        aria-label="Engine Settings"
                        className="rounded-full fill-slate-400 hover:fill-slate-300 transition duration-100 p-1 touch-manipulation outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 -960 960 960">
                            <path d="M433-80q-27 0-46.5-18T363-142l-9-66q-13-5-24.5-12T307-235l-62 26q-25 11-50 2t-39-32l-47-82q-14-23-8-49t27-43l53-40q-1-7-1-13.5v-27q0-6.5 1-13.5l-53-40q-21-17-27-43t8-49l47-82q14-23 39-32t50 2l62 26q11-8 23-15t24-12l9-66q4-26 23.5-44t46.5-18h94q27 0 46.5 18t23.5 44l9 66q13 5 24.5 12t22.5 15l62-26q25-11 50-2t39 32l47 82q14 23 8 49t-27 43l-53 40q1 7 1 13.5v27q0 6.5-2 13.5l53 40q21 17 27 43t-8 49l-48 82q-14 23-39 32t-50-2l-60-26q-11 8-23 15t-24 12l-9 66q-4 26-23.5 44T527-80h-94Zm49-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z"/>
                        </svg>
                    </button>

                    {/* Settings popup with transition */}
                    <div
                        ref={settingsRef}
                        className={`absolute right-0 transform origin-top-right transition-all duration-200 ease-out ${
                            showSettings
                                ? "opacity-100 scale-100 translate-y-0 visible"
                                : "opacity-0 scale-95 -translate-y-2 invisible"
                        } top-9 bg-slate-800 rounded-lg border border-slate-600 shadow-lg p-3 z-10 w-64 sm:min-w-64 max-w-[calc(100vw-24px)]`}
                    >
                        <h3 className="text-slate-200 text-sm font-semibold mb-3">Engine Settings</h3>

                        <div className="space-y-4">
                            {/* MultiPV Setting */}
                            <div className="space-y-1">
                                <label htmlFor="multipv-select" className="text-slate-300 text-xs block">
                                    Analysis Lines
                                </label>
                                <select
                                    id="multipv-select"
                                    className="w-full bg-slate-700 text-slate-200 text-sm rounded px-2 py-2 border border-slate-600 disabled:opacity-50 outline-none"
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
                            </div>

                            {/* Search Depth Setting */}
                            <div className="space-y-1">
                                <label htmlFor="depth-select" className="text-slate-300 text-xs block">
                                    Search Depth
                                </label>
                                <select
                                    id="depth-select"
                                    className="w-full bg-slate-700 text-slate-200 text-sm rounded px-2 py-2 border border-slate-600 disabled:opacity-50 outline-none"
                                    value={searchDepth}
                                    onChange={(e) => setSearchDepth(Number(e.target.value))}
                                    disabled={isAnalyzing}
                                >
                                    <option value={15}>15 (fastest)</option>
                                    <option value={18}>18</option>
                                    <option value={20}>20 (balanced)</option>
                                    <option value={22}>22</option>
                                    <option value={25}>25</option>
                                    <option value={30}>30 (strongest)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analyze/Stop button */}
                <button
                    onClick={handleAnalysisClick}
                    className={`flex flex-nowrap items-center px-2 py-1 text-sm rounded transition-all gap-1 font-semibold touch-manipulation ${
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