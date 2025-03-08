import { AnalyzeIcon } from './AnalyzeIcon';

export function AnalysisToggle({ disabled, isAnalysisOn, handleAnalysisOn, handleAnalysisOff }) {
    return (
        <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isAnalysisOn}
                    onChange={e => {
                        if (e.target.checked) {
                            handleAnalysisOn();
                        } else {
                            handleAnalysisOff();
                        }
                    }}
                    disabled={disabled}
                />
                <div
                    className={`
                    relative flex items-center w-14 h-7 rounded-full border-2 border-slate-400 transition-all bg-slate-400 duration-300 ease-in-out
                    ${isAnalysisOn ? 'bg-opacity-100' : 'bg-opacity-0'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                >
                    {/* Toggle handle with icon */}
                    <div
                        className={`
                        absolute h-4 w-4 rounded-full transition-all duration-300
                        flex items-center justify-center bg-slate-950
                        ${isAnalysisOn ? 'translate-x-8' : 'translate-x-1'}
                        shadow-md
                    `}
                    >
                        <div
                            className={`
                            transition-colors duration-300
                        `}
                        >
                            {/*{isAnalysisOn ? <StopIcon /> : <AnalyzeIcon />}*/}
                            <AnalyzeIcon />
                        </div>
                    </div>
                    {/* Text inside the toggle */}
                    <span
                        className={`
                        absolute flex text-xs italic font-medium transition-all duration-300 text-slate-100
                        ${isAnalysisOn ? 'left-2' : 'right-1.5'}
                    `}
                    >
                        {isAnalysisOn ? 'ON' : 'OFF'}
                    </span>
                </div>
            </label>
        </div>
    );
}
