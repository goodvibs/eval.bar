import {StopIcon} from "./StopIcon";
import {AnalyzeIcon} from "./AnalyzeIcon";

export function AnalysisButton({ isAnalyzing, handleAnalysisClick }) {
    return (
        <button
            onClick={handleAnalysisClick}
            className={`flex flex-nowrap items-center px-2 py-1 text-sm rounded transition-all gap-1 font-semibold touch-manipulation ${
                isAnalyzing
                    ? 'bg-red-600 hover:bg-red-700 text-slate-100'
                    : 'bg-green-600 hover:bg-green-500 text-slate-100'
            }`}
        >
            {isAnalyzing ? <StopIcon /> : <AnalyzeIcon />}
            {isAnalyzing ? 'Stop' : 'Analyze'}
        </button>
    );
}