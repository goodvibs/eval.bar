import {Chessboard} from "react-chessboard";
import {ChessboardControls} from "./ChessboardControls";
import React from "react";
import {useGameStore} from "../../stores/gameStore";

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

    function firstMove() {
        goToMove(-1);
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

    function lastMove() {
        let index = moveHistory.length > 0 ? moveHistory.length - 1 : 0;
        goToMove(index);
    }

    const [orientedWhite, setOrientedWhite] = React.useState(true);

    return (
        <div className="flex flex-col w-fit border-slate-500 border rounded-lg p-2 pb-0">
            <Chessboard
                position={currentFen}
                boardWidth={500}
                customLightSquareStyle={{backgroundColor: "#cbd5e1"}}
                customDarkSquareStyle={{backgroundColor: "#64748b"}}
                boardOrientation={orientedWhite ? "white" : "black"}
                onPieceDrop={onPieceDrop}
            />

            <ChessboardControls
                firstMove={firstMove}
                previousMove={previousMove}
                nextMove={nextMove}
                lastMove={lastMove}
                orientedWhite={orientedWhite}
                setOrientedWhite={setOrientedWhite}
            />
        </div>
    );
}