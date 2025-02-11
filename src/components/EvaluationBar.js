import {useGameStore} from "../stores/gameStore";

export function EvaluationBar() {
    const { analysis } = useGameStore();
    const evalBarWidth = ((analysis.evaluation * 10 + 100) / 2).toPrecision(2) + "%";

    return (
        <div className="flex bg-slate-900">
            <svg className="fill-slate-50" width={evalBarWidth} height={30}>
                <rect className="w-full" height={30}/>
            </svg>
        </div>
    );
}