import { AnalyzeIcon } from "./AnalyzeIcon";

export function AnalysisToggle({ disabled, isAnalyzing, handleAnalysisClick }) {
    return (
        <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isAnalyzing}
                    onChange={handleAnalysisClick}
                    disabled={disabled}
                />
                <div className={`
                    relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 ease-in-out
                    ${isAnalyzing
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}>
                    {/* Toggle handle with icon */}
                    <div className={`
                        absolute h-5 w-5 top-1 rounded-full transition-all duration-300
                        flex items-center justify-center bg-slate-100
                        ${isAnalyzing
                        ? 'translate-x-8'
                        : 'translate-x-1'
                    }
                        shadow-md
                    `}>
                        <AnalyzeIcon />
                    </div>
                    {/* Text inside the toggle */}
                    <span className={`
                        absolute flex text-xs font-medium transition-all duration-300
                        ${isAnalyzing
                        ? 'left-2 text-slate-100'
                        : 'right-1.5 text-slate-500'
                    }
                    `}>
                        {isAnalyzing ? 'ON' : 'OFF'}
                    </span>
                </div>
            </label>
        </div>
    );
}