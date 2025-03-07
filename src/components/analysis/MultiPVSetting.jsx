export function MultiPVSetting({ isAnalysisOn, multiPV, handleMultiPVChange }) {
    return (
        <div className="space-y-1">
            <label htmlFor="multipv-select" className="text-slate-300 text-xs block">
                Analysis Lines
            </label>
            <select
                id="multipv-select"
                className="w-full bg-slate-700 text-slate-200 text-base rounded px-2 py-2 border border-slate-600 disabled:opacity-50 outline-none"
                value={multiPV}
                onChange={e => handleMultiPVChange(parseInt(e.target.value))}
                disabled={isAnalysisOn}
            >
                <option value={1}>1 line</option>
                <option value={2}>2 lines</option>
                <option value={3}>3 lines</option>
                <option value={4}>4 lines</option>
                <option value={5}>5 lines</option>
            </select>
        </div>
    );
}
