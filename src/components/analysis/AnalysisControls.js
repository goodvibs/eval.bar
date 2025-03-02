import {AnalysisToggle} from "./AnalysisToggle";
import {AnalysisSettingsButton} from "./AnalysisSettingsButton";

export function AnalysisControls({ disabled, isAnalysisOn, handleAnalysisOn, handleAnalysisOff, handleMultiPVChange, handleGoalDepthChange, goalSearchDepth, multiPV }) {
    return (
        <div className="flex items-center gap-2 px-2">
            <AnalysisSettingsButton
                isAnalysisOn={isAnalysisOn}
                handleMultiPVChange={handleMultiPVChange}
                handleGoalDepthChange={handleGoalDepthChange}
                disabled={disabled}
                goalSearchDepth={goalSearchDepth}
                multiPV={multiPV}
            />
            <AnalysisToggle
                isAnalysisOn={isAnalysisOn}
                handleAnalysisOn={handleAnalysisOn}
                handleAnalysisOff={handleAnalysisOff}
                disabled={disabled}
            />
        </div>
    );
}