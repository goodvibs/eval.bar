import React from "react";
import {AnalysisPanel} from "./analysis/AnalysisPanel";
import {MoveHistory} from "./moves/MoveHistory";
import {useGameStore} from "../stores/gameStore";
import {ChessboardControlPanel} from "./chessboard/ChessboardControlPanel";
import {GameMetadata} from "./gameMetadata";

export function GameArea() {
    const { gameMetadata } = useGameStore();

    return (
        <main className="flex flex-1 justify-center flex-wrap lg:flex-nowrap gap-4 p-4 overflow-hidden">
            <div className="flex h-fit flex-col gap-4">
                <GameMetadata metadata={gameMetadata} />
                <ChessboardControlPanel />
            </div>

            <div
                className="flex flex-col flex-1 min-w-72 gap-4"
            >
                <AnalysisPanel />
                <MoveHistory />
            </div>
        </main>
    );
}