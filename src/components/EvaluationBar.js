import React, { useMemo } from "react";
import { useEngineStore } from "../stores/useEngineStore";

export function EvaluationBar({ height = "h-1.5", showLabels = false }) {
    const { currentLines } = useEngineStore();

    const mainLine = currentLines[0];
    const eval_ = mainLine?.score ?? 0;

    // Enhanced evaluation processing with better mate handling
    const evalDetails = useMemo(() => {
        // Handle mate scores
        if (typeof eval_ === 'string') {
            const isMateForWhite = eval_.startsWith('M');
            return {
                percentage: isMateForWhite ? 98 : 2,
                formattedEval: eval_
            };
        }

        // Handle numerical scores (centipawns)
        const coefficient = 0.2; // Controls the slope of the sigmoid
        const percentage = (1 / (1 + Math.exp(-eval_ * coefficient))) * 100;
        const clampedPercentage = Math.min(Math.max(percentage, 2), 98);

        const formattedEval = eval_ > 0
            ? `+${eval_.toFixed(1)}`
            : eval_.toFixed(1);

        return {
            percentage: clampedPercentage,
            formattedEval
        };
    }, [eval_]);

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
                    <span>{evalDetails.formattedEval}</span>
                    <span>Black</span>
                </div>
            )}

            <div className={`flex ${height} relative`}>
                {/* White's side of the evaluation bar */}
                <div
                    className="bg-slate-100 transition-all duration-300 ease-out"
                    style={{ width: `${evalDetails.percentage}%` }}
                />

                {/* Black's side of the evaluation bar */}
                <div
                    className="bg-slate-900 flex-1 transition-all duration-300 ease-out"
                />

                {/* Marker bars - keeping your original implementation */}
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