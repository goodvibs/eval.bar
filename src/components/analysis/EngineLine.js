import React from "react";
import {useGameStore} from "../../hooks/stores/useGameStore";
import {Chess} from "cm-chess";


const uciMovesToSan = (initialFen, uciMoves) => {
    if (!initialFen || !uciMoves || uciMoves.length === 0) {
        return [];
    }

    const formattedMoves = [];
    let position = new Chess(initialFen);

    for (const uciMove of uciMoves) {
        const from = uciMove.substring(0, 2);
        const to = uciMove.substring(2, 4);
        const promotion = uciMove.length > 4 ? uciMove.substring(4, 5) : '';

        const move = position.move({from, to, promotion});
        if (!move) {
            console.error(`Invalid move in engine line: ${uciMove} in position ${position.fen()}`);
            break;
        }

        formattedMoves.push(move.san);
    }

    return formattedMoves;
}

export function EngineLine({ uciMoves, evaluation, isMainLine, isLastLine, onMoveClick }) {
    const { getCurrentTurn, getCurrentHalfmoveCount, getCurrentFen } = useGameStore.getState();

    const baseHalfmoveCount = getCurrentHalfmoveCount();
    const baseIsBlackMove = getCurrentTurn() === 'b';

    // Determine background color based on winning color using our utility
    const evalBgColor = evaluation.advantage === 'equal' ? "bg-slate-500 text-slate-100" : (
        evaluation.advantage === 'white'
        ? "bg-slate-100 text-slate-900"
        : "bg-slate-900 text-slate-100"
    );

    // const sanMoves = uciMovesToSan(getCurrentFen(), uciMoves);
    const sanMoves = uciMoves;

    return (
        <div className="flex items-center hover:bg-slate-700 transition-colors text-sm gap-2">
            <div className={`flex whitespace-nowrap font-mono px-0.5 rounded-r-3xl ${isMainLine ? "font-bold" : ""} ${isLastLine ? "rounded-bl-lg" : ""} ${evalBgColor}`}>
                {evaluation.formattedEvaluation}
            </div>
            <div className="flex gap-1 text-slate-300 whitespace-nowrap overflow-x-auto scrollbar-none">
                {sanMoves.map((san, idx) => {
                    const number = Math.floor((baseHalfmoveCount + idx) / 2) + 1;
                    const isBlackMove = baseIsBlackMove ? idx % 2 === 0 : idx % 2 === 1;
                    const showMoveNumber = !isBlackMove || idx === 0;

                    return (
                        <button
                            key={idx}
                            onClick={() => onMoveClick(sanMoves.slice(0, idx + 1))}
                            className="hover:text-slate-100 hover:underline transition-colors flex-none"
                        >
                            {showMoveNumber && (
                                <span className="text-slate-500 mr-1">
                                    {number}{isBlackMove ? '...' : '.'}
                                </span>
                            )}
                            {san}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}