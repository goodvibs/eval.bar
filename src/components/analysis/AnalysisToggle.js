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
                    relative w-14 h-7 border-2 border-slate-400 rounded-full transition-colors duration-300 ease-in-out
                    ${isAnalyzing
                    ? 'bg-slate-400'
                    : 'bg-transparent'
                }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}>
                    {/* Toggle handle with icon */}
                    <div className={`
                        absolute h-4 w-4 top-1 rounded-full transition-all duration-300
                        flex items-center justify-center bg-slate-100
                        ${isAnalyzing
                        ? 'translate-x-8 scale-[1.2]'
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