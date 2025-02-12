import React from "react";
import {AnalysisPanel} from "./analysis/AnalysisPanel";
import {MoveHistory} from "./moves/MoveHistory";
import {useGameStore} from "../stores/gameStore";
import {ChessboardControlPanel} from "./ChessboardControlPanel";

export function GameArea() {
    const {
        metadata
    } = useGameStore();

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-4">
                {/* Game metadata */}
                {metadata.white && metadata.black && (
                    <div className="flex justify-between items-center text-slate-300">
                        <div className="text-lg">
                            {metadata.white} vs {metadata.black}
                        </div>
                        <div className="text-sm text-slate-400">
                            {metadata.date} • {metadata.event}
                        </div>
                    </div>
                )}

                <ChessboardControlPanel />
            </div>

            <div className="flex flex-col w-96 gap-4">
                <AnalysisPanel />
                <MoveHistory />
            </div>
        </div>
    );
}