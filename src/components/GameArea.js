import React from "react";
import {Chessboard} from "react-chessboard";
import {ChessboardControls} from "./ChessboardControls";
import {AnalysisPanel} from "./AnalysisPanel/AnalysisPanel";
import {MoveHistory} from "./MoveHistory";
import {useGameStore} from "../stores/gameStore";

export function GameArea() {
    const {
        currentFen,
        makeMove,
        goToMove,
        currentMoveIndex,
        moveHistory,
        metadata
    } = useGameStore();

    const [orientedWhite, setOrientedWhite] = React.useState(true);

    function onPieceDrop(sourceSquare, targetSquare) {
        return makeMove({
            from: sourceSquare,
            to: targetSquare
        });
    }

    function previousMove() {
        if (currentMoveIndex > -1) {
            goToMove(currentMoveIndex - 1);
        }
    }

    function nextMove() {
        if (currentMoveIndex < moveHistory.length - 1) {
            goToMove(currentMoveIndex + 1);
        }
    }

    return (
        <div className="flex gap-4 flex-1">
            <div className="flex flex-col gap-4 flex-1">
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

                {/* Board and controls */}
                <div className="border-slate-500 border rounded p-4 py-2">
                    <Chessboard
                        position={currentFen}
                        boardWidth={500}
                        customLightSquareStyle={{backgroundColor: "#cbd5e1"}}
                        customDarkSquareStyle={{backgroundColor: "#64748b"}}
                        boardOrientation={orientedWhite ? "white" : "black"}
                        onPieceDrop={onPieceDrop}
                    />

                    <ChessboardControls
                        previousMove={previousMove}
                        nextMove={nextMove}
                        orientedWhite={orientedWhite}
                        setOrientedWhite={setOrientedWhite}
                    />
                </div>

                <MoveHistory />
            </div>

            <div className="w-96">
                <AnalysisPanel />
            </div>
        </div>
    );
}