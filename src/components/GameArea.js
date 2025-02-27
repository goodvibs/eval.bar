import React from "react";
import {AnalysisPanel} from "./analysis/AnalysisPanel";
import {MoveHistoryPanel} from "./moves/MoveHistoryPanel";
import {ChessboardPanel} from "./chessboard/ChessboardPanel";
import {GameMetadata} from "./GameMetadata";

export function GameArea() {

    return (
        <main className="flex flex-1 justify-center flex-wrap lg:flex-nowrap gap-4 lg:pl-1 p-4 overflow-hidden">
            <div className="flex h-fit flex-col gap-4">
                <GameMetadata />
                <ChessboardPanel />
            </div>

            <div
                className="flex flex-col flex-1 min-w-72 gap-4"
            >
                <AnalysisPanel />
                <MoveHistoryPanel />
            </div>
        </main>
    );
}