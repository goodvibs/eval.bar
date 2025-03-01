export function EvaluationDisplay({ evalDetails }) {
    const evalBgColor = evalDetails.winningColor === "white" || evalDetails.advantage === "equal"
        ? "bg-slate-100 text-slate-900"
        : "bg-slate-900 text-slate-100";

    return (
        <div className={`flex font-mono p-2 text-lg font-bold rounded-tl-lg rounded-r-3xl ${evalBgColor}`}>
            {evalDetails.formattedScore}
        </div>
    );
}