import React, { useMemo } from "react";
import { useEngineStore } from "../stores/useEngineStore";
import { processEvaluation } from "../utils/evaluation";

export function EvaluationBar({ height = "h-1.5", showLabels = false }) {
    const { currentLines } = useEngineStore();

    const mainLine = currentLines[0];
    const rawEval = mainLine?.score ?? 0;

    // Process the evaluation using our centralized utility
    const evalDetails = useMemo(() => {
        return processEvaluation(rawEval);
    }, [rawEval]);

    // Create marker positions (as percentages)
    const markers = useMemo(() => {
        return [10, 20, 30, 40, 50, 60, 70, 80, 90].map(pos => ({
            position: pos,
            // Opacity increases as we get closer to the center (50%)
            opacity: 1 - Math.abs(50 - pos) / 50
        }));
    }, []);

    return (
        <div className="flex flex-col w-full">
            {showLabels && (
                <div className="text-xs text-slate-300 mb-1 flex justify-between px-1">
                    <span>White</span>
                    <span>{evalDetails.formattedScore}</span>
                    <span>Black</span>
                </div>
            )}

            <div className={`flex ${height} relative`}>
                {/* White's side of the evaluation bar */}
                <div
                    className="bg-slate-100 transition-all duration-300 ease-out"
                    style={{ width: `${evalDetails.barPercentage}%` }}
                />

                {/* Black's side of the evaluation bar */}
                <div
                    className="bg-slate-900 flex-1 transition-all duration-300 ease-out"
                />

                {/* Marker bars */}
                {markers.map(({ position, opacity }) => (
                    <div
                        key={position}
                        className="absolute top-0 bottom-0 w-px border border-slate-500 bg-slate-500"
                        style={{
                            left: `${position}%`,
                            opacity: opacity,
                            pointerEvents: 'none' // Ensures markers don't interfere with interactions
                        }}
                    />
                ))}
            </div>
        </div>
    );
}