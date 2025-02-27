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
        <div className="bg-slate-700 border-b gap-4 border-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <EvaluationDisplay evalDetails={evalDetails} />
                <EngineInfo
                    isAnalyzing={isAnalyzing}
                    depth={depth}
                    engineReady={engineReady}
                />
            </div>

            <AnalysisControls
                isAnalyzing={isAnalyzing}
                handleAnalysisClick={onAnalysisToggle}
                disabled={!engineReady}
            />
        </div>
    );
}