import {MultiPVSetting} from "./MultiPVSetting";
import {DepthSetting} from "./DepthSetting";

export function AnalysisSettingsMenu({ settingsRef, showSettings, isAnalysisOn, handleGoalDepthChange, handleMultiPVChange, goalSearchDepth, multiPV }) {
    return (
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
                <MultiPVSetting isAnalysisOn={isAnalysisOn} handleMultiPVChange={handleMultiPVChange} multiPV={multiPV} />
                <DepthSetting isAnalysisOn={isAnalysisOn} handleGoalDepthChange={handleGoalDepthChange} goalSearchDepth={goalSearchDepth} />
            </div>
        </div>
    );
}