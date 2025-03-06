import React, {useRef} from "react";
import { GameMetadata } from "./GameMetadata";
import { ChessboardPanel } from "./chessboard/ChessboardPanel";
import { AnalysisPanel } from "./analysis/AnalysisPanel";
import { MoveHistoryPanel } from "./moves/MoveHistoryPanel";
import { useBoardResize } from "../hooks/useBoardResize";
import {usePositionSync} from "../hooks/usePositionSync";
import {useGameDerivedState} from "../hooks/stores/useGameStore";

export function MainContent() {
    console.log('MainContent');

    const mainRef = useRef(null);

    const { fen } = useGameDerivedState();
    usePositionSync({ currentFen: fen });

    const { boardWidth, rightPanelWidth } = useBoardResize();

    return (
        <div className="flex flex-col flex-grow overflow-hidden">
            <main
                ref={mainRef}
                className="flex justify-center flex-wrap gap-4 lg:pl-1 p-4 min-h-[calc(100vh-3rem)] overflow-auto"
            >
                {/* Chess board section */}
                <div className="flex h-fit flex-col gap-4">
                    <GameMetadata />
                    <ChessboardPanel boardWidth={boardWidth} />
                </div>

                {/* Analysis section */}
                <div
                    className="flex flex-col min-w-72 gap-4"
                    style={{ width: rightPanelWidth }}
                >
                    <AnalysisPanel />
                    <MoveHistoryPanel />
                </div>
            </main>
        </div>
    );
}