import {useEngineStore} from "../stores/useEngineStore";

export function EvaluationBar() {
    const { currentLines } = useEngineStore();

    const mainLine = currentLines[0];
    const eval_ = mainLine?.score ?? 0;

    const getEvalPercent = (eval_) => {
        if (typeof eval_ === 'string') {
            return eval_.startsWith('M') ? 98 : 2;
        }
        const coefficient = 0.2;
        const percentage = (1 / (1 + Math.exp(-eval_ * coefficient))) * 100;
        return Math.min(Math.max(percentage, 2), 98);
    };

    const percentage = getEvalPercent(eval_);

    // Create marker positions (as percentages)
    const markers = [10, 20, 30, 40, 50, 60, 70, 80, 90].map(pos => ({
        position: pos,
        // Opacity increases as we get closer to the center (60%)
        opacity: 1 - Math.abs(60 - pos) / 60
    }));

    return (
        <div className="flex h-1.5 relative">
            {/* Base evaluation bar */}
            <div
                className="bg-slate-200 transition-all duration-300"
                style={{ width: `${percentage}%` }}
            />
            <div
                className="bg-slate-900 flex-1 transition-all duration-300"
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
    );
}