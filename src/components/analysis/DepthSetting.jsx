export function DepthSetting({ isAnalysisOn, goalSearchDepth, handleGoalDepthChange }) {
    return (
        <div className="space-y-1">
            <label htmlFor="depth-select" className="text-slate-300 text-xs block">
                Search Depth
            </label>
            <select
                id="depth-select"
                className="w-full bg-slate-700 text-slate-200 text-base rounded px-2 py-2 border border-slate-600 disabled:opacity-50 outline-none"
                value={goalSearchDepth}
                onChange={e => handleGoalDepthChange(parseInt(e.target.value))}
                disabled={isAnalysisOn}
            >
                <option value={15}>15 (fastest)</option>
                <option value={18}>18</option>
                <option value={20}>20 (balanced)</option>
                <option value={22}>22</option>
                <option value={25}>25</option>
                <option value={30}>30 (strongest)</option>
            </select>
        </div>
    );
}
