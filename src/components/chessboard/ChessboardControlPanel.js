import { Chessboard } from "react-chessboard";
import { ChessboardControls } from "./ChessboardControls";
import React from "react";
import { useGameStore } from "../../stores/gameStore";

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
    const [boardWidth, setBoardWidth] = React.useState(500);
    const containerRef = React.useRef(null);

    // Resize observer to update board size dynamically
    React.useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries.length > 0) {
                setBoardWidth(entries[0].contentRect.width);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col duration-300 transition-all w-[450px] sm:w-[560px] md:w-[336px] lg:w-[500px] xl:w-[560px] 2xl:w-[700px] border-slate-500 border rounded-lg p-2 pb-0">
            <Chessboard
                position={currentFen}
                boardWidth={boardWidth}
                customLightSquareStyle={{ backgroundColor: "#cbd5e1" }}
                customDarkSquareStyle={{ backgroundColor: "#64748b" }}
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
