import {Chessboard} from "react-chessboard";
import {ChessboardControls} from "./ChessboardControls";
import React from "react";
import {useGameStore} from "../stores/gameStore";

export function ChessboardControlPanel() {
    const {
        currentFen,
        makeMove,
        goToMove,
        currentMoveIndex,
        moveHistory,
    } = useGameStore();

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

    const [orientedWhite, setOrientedWhite] = React.useState(true);

    return (
        <div className="flex flex-col w-fit border-slate-500 border rounded-lg p-4">
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
    );
}