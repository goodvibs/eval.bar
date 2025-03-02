import React from "react";
import {EvaluationDisplay} from "./EvaluationDisplay";
import {EngineInfo} from "./EngineInfo";
import {AnalysisControls} from "./AnalysisControls";

export function AnalysisPanelHeader({
                                        isAnalysisOn,
                                        depth,
                                        formattedEvaluation,
                                        advantage,
                                        handleAnalysisOn,
                                        handleAnalysisOff,
                                        handleMultiPVChange,
                                        handleGoalDepthChange,
                                        engineReady
                                    }) {

    return (
        <div className="border-b bg-slate-700 border-slate-600 flex items-center justify-between">
            <EvaluationDisplay formattedEvaluation={formattedEvaluation} advantage={advantage} />
            <div className="flex pl-4 flex-1 h-full items-center gap-4">
                <EngineInfo
                    isAnalysisOn={isAnalysisOn}
                    depth={depth}
                    engineReady={engineReady}
                />

                <AnalysisControls
                    isAnalysisOn={isAnalysisOn}
                    handleAnalysisOn={handleAnalysisOn}
                    handleAnalysisOff={handleAnalysisOff}
                    handleMultiPVChange={handleMultiPVChange}
                    handleGoalDepthChange={handleGoalDepthChange}
                    disabled={!engineReady}
                />
            </div>

        </div>
    );
}