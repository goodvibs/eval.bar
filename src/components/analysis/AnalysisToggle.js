import { AnalyzeIcon } from "./AnalyzeIcon";
import { StopIcon } from "./StopIcon";

export function AnalysisToggle({ disabled, isAnalysisOn, handleAnalysisOn, handleAnalysisOff }) {
    return (
        <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isAnalysisOn}
                    onChange={(e) => {
                        if (e.target.checked) {
                            handleAnalysisOn();
                        } else {
                            handleAnalysisOff();
                        }
                    }}
                    disabled={disabled}
                />
                <div className={`
                    relative flex items-center w-14 h-7 rounded-full transition-all duration-300 ease-in-out bg-size-200 bg-pos-0 hover:bg-pos-100
                    ${isAnalysisOn
                    ? 'bg-gradient-to-r from-green-400 to-orange-500'
                    : 'bg-gradient-to-r from-gray-400 to-gray-300'
                }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}>
                    {/* Toggle handle with icon */}
                    <div className={`
                        absolute h-5 w-5 rounded-full transition-all duration-300
                        flex items-center justify-center
                        ${isAnalysisOn
                        ? 'translate-x-8 bg-gradient-to-br from-white to-slate-100'
                        : 'translate-x-1 bg-gradient-to-br from-slate-100 to-slate-200'
                    }
                        shadow-md
                    `}>
                        <div className={`
                            transition-colors duration-300
                        `}>
                            {/*{isAnalysisOn ? <StopIcon /> : <AnalyzeIcon />}*/}
                            <AnalyzeIcon />
                        </div>
                    </div>
                    {/* Text inside the toggle */}
                    <span className={`
                        absolute flex text-xs italic font-medium transition-all duration-300 text-slate-100
                        ${isAnalysisOn
                        ? 'left-2'
                        : 'right-1.5'
                    }
                    `}>
                        {isAnalysisOn ? 'ON' : 'OFF'}
                    </span>
                </div>
            </label>
        </div>
    );
}