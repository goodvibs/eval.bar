import React, {useMemo} from "react";
import {useAnalysis} from "../hooks/useAnalysis";

const calcBarPercentage = (advantage, cp, mate) => {
    if (advantage === 'equal') {
        return 50;
    }

    if (mate !== null) {
        return advantage === 'white' ? 100 : 0;
    }

    const coefficient = 0.2; // Controls the curve steepness
    const percentage = (1 / (1 + Math.exp(-(cp / 100) * coefficient))) * 100;
     // Clamp between 2-98%
    return Math.min(Math.max(percentage, 2), 98);
}

export function EvaluationBar({ height = "h-1.5" }) {
    const { advantage, cp, mate } = useAnalysis();

    // Create marker positions (as percentages)
    const markers = useMemo(() => {
        return [10, 20, 30, 40, 50, 60, 70, 80, 90].map(pos => ({
            position: pos,
            // Opacity increases as we get closer to the center (50%)
            opacity: 1 - Math.abs(50 - pos) / 50
        }));
    }, []);

    const barPercentage = useMemo(() => calcBarPercentage(advantage, cp, mate), [advantage, cp, mate]);

    return (
        <div className="flex flex-col w-full">
            <div className={`flex ${height} relative`}>
                {/* White's side of the evaluation bar */}
                <div
                    className="bg-slate-100 transition-all duration-300 ease-out"
                    style={{ width: `${barPercentage}%` }}
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