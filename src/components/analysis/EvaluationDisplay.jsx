export function EvaluationDisplay({ formattedEvaluation, advantage }) {
    const evalBgColor =
        advantage === 'equal'
            ? 'bg-slate-500 text-slate-100'
            : advantage === 'black'
              ? 'bg-slate-900 text-slate-100'
              : 'bg-slate-100 text-slate-900';

    return (
        <div className={`flex font-mono px-2 py-0.5 text-2xl font-bold rounded-3xl ${evalBgColor}`}>
            {formattedEvaluation}
        </div>
    );
}
