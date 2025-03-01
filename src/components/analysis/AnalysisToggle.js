import { AnalyzeIcon } from "./AnalyzeIcon";
import { StopIcon } from "./StopIcon";

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
                    relative flex items-center w-14 h-7 rounded-full transition-all duration-300 ease-in-out bg-size-200 bg-pos-0 hover:bg-pos-100
                    ${isAnalyzing
                    ? 'bg-gradient-to-r from-blue-500 via-green-400 to-purple-500'
                    : 'bg-gradient-to-r from-gray-400 to-gray-300'
                }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}>
                    {/* Toggle handle with icon */}
                    <div className={`
                        absolute h-5 w-5 rounded-full transition-all duration-300
                        flex items-center justify-center
                        ${isAnalyzing
                        ? 'translate-x-8 bg-gradient-to-br from-white to-slate-100'
                        : 'translate-x-1 bg-gradient-to-br from-slate-100 to-slate-200'
                    }
                        shadow-md
                    `}>
                        <div className={`
                            transition-colors duration-300
                        `}>
                            {isAnalyzing ? <StopIcon /> : <AnalyzeIcon />}
                        </div>
                    </div>
                    {/* Text inside the toggle */}
                    <span className={`
                        absolute flex text-xs italic font-medium transition-all duration-300 text-slate-100
                        ${isAnalyzing
                        ? 'left-2'
                        : 'right-1.5'
                    }
                    `}>
                        {isAnalyzing ? 'ON' : 'OFF'}
                    </span>
                </div>
            </label>
        </div>
    );
}