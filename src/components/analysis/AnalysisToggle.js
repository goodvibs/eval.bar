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
                    relative w-14 h-7 rounded-full transition-colors duration-300 ease-in-out
                    ${isAnalyzing
                    ? 'bg-green-600'
                    : 'bg-gray-200'
                }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}>
                    {/* Toggle handle with icon */}
                    <div className={`
                        absolute h-5 w-5 top-1 rounded-full bg-slate-100 transition-all duration-300
                        flex items-center justify-center
                        ${isAnalyzing
                        ? 'translate-x-8'
                        : 'translate-x-1'
                    }
                        shadow-md
                    `}>
                        <AnalyzeIcon />
                    </div>
                </div>
            </label>
        </div>
    );
}