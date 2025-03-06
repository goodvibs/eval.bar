import React from "react";
import {EvaluationDisplay} from "./EvaluationDisplay";
import {EngineInfo} from "./EngineInfo";
import {AnalysisControls} from "./AnalysisControls";
import {
    useEngineActions,
    useEngineAnalysis, useEngineConfig, useIsAnalysisOn,
    useIsEngineReady
} from "../../hooks/stores/useEngineStore";

export function AnalysisPanelHeader() {

    const { startAnalysis, endAnalysis, setAndSendMultiPV, setGoalSearchDepth } = useEngineActions();
    const isAnalysisOn = useIsAnalysisOn();
    const isEngineReady = useIsEngineReady();
    const { multiPV, goalSearchDepth } = useEngineConfig();
    const { formattedEvaluation, advantage } = useEngineAnalysis();

    return (
        <div className="border-b bg-slate-700 border-slate-600 flex items-center justify-between">
            <EvaluationDisplay formattedEvaluation={formattedEvaluation} advantage={advantage} />
            <div className="flex pl-4 flex-1 h-full items-center gap-4">
                <EngineInfo />

                <AnalysisControls
                    isAnalysisOn={isAnalysisOn}
                    handleAnalysisOn={startAnalysis}
                    handleAnalysisOff={endAnalysis}
                    handleMultiPVChange={setAndSendMultiPV}
                    handleGoalDepthChange={setGoalSearchDepth}
                    disabled={!isEngineReady}
                    goalSearchDepth={goalSearchDepth}
                    multiPV={multiPV}
                />
            </div>

        </div>
    );
}