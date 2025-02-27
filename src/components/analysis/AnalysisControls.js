import {AnalysisToggle} from "./AnalysisToggle";
import {SettingsButton} from "./AnalysisSettingsButton";

export function AnalysisControls({ disabled, isAnalyzing, handleAnalysisClick }) {
    return (
        <div className="flex items-center gap-2 px-2">
            <SettingsButton isAnalyzing={isAnalyzing} />
            <AnalysisToggle
                isAnalyzing={isAnalyzing}
                handleAnalysisClick={handleAnalysisClick}
                disabled={disabled}
            />
        </div>
    );
}