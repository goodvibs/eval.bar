import React from "react";
import { processEvaluation } from "../../utils/evaluation";
import {EvaluationDisplay} from "./EvaluationDisplay";
import {EngineInfo} from "./EngineInfo";
import {AnalysisControls} from "./AnalysisControls";

export function AnalysisPanelHeader({
                                        isAnalyzing,
                                        depth,
                                        currentLines,
                                        onAnalysisToggle,
                                        engineReady
                                    }) {
    const mainLine = currentLines[0];
    const rawEval = mainLine?.score ?? 0;
    const evalDetails = processEvaluation(rawEval);

    return (
        <div className="border-b bg-slate-700 border-slate-600 flex items-center justify-between">
            <EvaluationDisplay evalDetails={evalDetails} />
            <div className="flex pl-4 flex-1 h-full items-center gap-4">
                <EngineInfo
                    isAnalyzing={isAnalyzing}
                    depth={depth}
                    engineReady={engineReady}
                />

                <AnalysisControls
                    isAnalyzing={isAnalyzing}
                    handleAnalysisClick={onAnalysisToggle}
                    disabled={!engineReady}
                />
            </div>

        </div>
    );
}