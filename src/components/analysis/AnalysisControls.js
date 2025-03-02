import {AnalysisToggle} from "./AnalysisToggle";
import {AnalysisSettingsButton} from "./AnalysisSettingsButton";

export function AnalysisControls({ disabled, isAnalysisOn, handleAnalysisOn, handleAnalysisOff, handleMultiPVChange, handleGoalDepthChange }) {
    return (
        <div className="flex items-center gap-2 px-2">
            <AnalysisSettingsButton
                isAnalysisOn={isAnalysisOn}
                handleMultiPVChange={handleMultiPVChange}
                handleGoalDepthChange={handleGoalDepthChange}
                disabled={disabled}
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