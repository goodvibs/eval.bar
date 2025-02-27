import {AnalysisButton} from "./AnalysisButton";
import {SettingsButton} from "./AnalysisSettingsButton";

export function AnalysisControls({ isAnalyzing, handleAnalysisClick }) {
    return (
        <div className="flex items-center gap-2 px-2">
            <SettingsButton isAnalyzing={isAnalyzing} />
            <AnalysisButton
                isAnalyzing={isAnalyzing}
                handleAnalysisClick={handleAnalysisClick}
            />
        </div>
    );
}