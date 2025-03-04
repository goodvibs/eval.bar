import { Chessboard } from "react-chessboard";
import { ChessboardControls } from "./ChessboardControls";
import React from "react";
import { useChessboard } from "../../hooks/useChessboard";

export function ChessboardPanel({ boardWidth }) {
    const {
        // State
        position,
        orientedWhite,
        customArrows,
        customSquareStyles,

        // Methods
        setOrientedWhite,
        handlePieceClick,
        onPieceDrop,

        // Navigation
        firstMove,
        previousMove,
        nextMove,
        lastMove
    } = useChessboard(boardWidth);

    return (
        <div
            className="flex z-0 flex-col duration-300 transition-all w-fit max-w-full gap-3"
        >
            <Chessboard
                position={position}
                boardWidth={boardWidth}
                customLightSquareStyle={{ backgroundColor: "#e1dfcb" }}
                customDarkSquareStyle={{ backgroundColor: "#648b67" }}
                boardOrientation={orientedWhite ? "white" : "black"}
                onPieceDrop={onPieceDrop}
                onPieceClick={handlePieceClick}
                onPieceDragBegin={handlePieceClick}
                customArrows={customArrows}
                customSquareStyles={customSquareStyles}
                animationDuration={200}
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