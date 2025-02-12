import {useEngineStore} from "../stores/useEngineStore";

export function EvaluationBar() {
    const { currentLines } = useEngineStore();

    // Get evaluation from the main line (first line)
    const mainLine = currentLines[0];
    const eval_ = mainLine?.score ?? 0;

    // Convert evaluation to a percentage for the bar width
    const getEvalPercent = (eval_) => {
        if (typeof eval_ === 'string') {
            // Handle mate scores
            return eval_.startsWith('M') ? 100 : 0;
        }

        // Convert centipawns to percentage
        // Using sigmoid-like function to keep it between 0-100
        // and make small advantages more visible
        const maxAdvantage = 5; // +5 pawns will show as winning
        const normalized = Math.min(Math.max(eval_, -maxAdvantage), maxAdvantage);
        const coefficient = 0.2;
        const percentage = (1 / (1 + Math.exp(-normalized * coefficient))) * 100;
        return percentage;
    };

    // Get background colors based on evaluation
    const getColors = (eval_) => {
        if (typeof eval_ === 'string') {
            // Mate scores
            return {
                white: 'bg-red-500',
                black: 'bg-red-900'
            };
        }

        return {
            white: 'bg-slate-200',
            black: 'bg-slate-900'
        };
    };

    const percentage = getEvalPercent(eval_);
    const colors = getColors(eval_);

    return (
        <div className="flex h-2">
            <div
                className={`${colors.white} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
            />
            <div
                className={`${colors.black} flex-1 transition-all duration-300`}
            />
        </div>
    );
}