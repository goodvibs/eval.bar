import { Chessboard } from "react-chessboard";
import { ChessboardControls } from "./ChessboardControls";
import React, { useEffect, useCallback } from "react";
import { useGameStore } from "../../hooks/stores/useGameStore";
import { useEngineStore } from "../../hooks/stores/useEngineStore";
import { useChessboardStore } from "../../hooks/stores/useChessboardStore";

export function ChessboardPanel({ boardWidth }) {
    // Get game state
    const {
        game,
        makeMove,
        goToMove,
        undo,
        redo,
        isKingInCheck,
    } = useGameStore();

    // Get engine state
    const { isAnalysisOn, currentLines } = useEngineStore();

    // Get UI state
    const {
        orientedWhite,
        setOrientedWhite,
        selectedPiece,
        possibleMoves,
        customArrows,
        selectPiece,
        clearSelection,
        setCustomArrows
    } = useChessboardStore();

    // Get the square of the king in check (if any)
    const kingInCheck = isKingInCheck();

    // Function to update arrows - this needs useCallback as it's a dependency in useEffect
    const updateArrows = useCallback(() => {
        // Only proceed if analyzing and lines exist
        if (!isAnalysisOn || !currentLines || currentLines.length === 0) {
            if (customArrows.length > 0) {
                setCustomArrows([]);
            }
            return;
        }

        try {
            // Get the best line (first line)
            const bestLine = currentLines[0];
            if (!bestLine || !bestLine.moves || bestLine.moves.length === 0) {
                if (customArrows.length > 0) {
                    setCustomArrows([]);
                }
                return;
            }

            // Get the first move in the best line
            const uciMove = bestLine.pvMoves[0];

            const from = uciMove.substring(0, 2);
            const to = uciMove.substring(2, 4);

            // Create new arrow array
            const newArrows = [[from, to, "#285b8d"]];

            setCustomArrows(newArrows);
        } catch (e) {
            console.error("Error setting best move arrow:", e);
            if (customArrows.length > 0) {
                setCustomArrows([]);
            }
        }
    }, [isAnalysisOn, currentLines, customArrows, setCustomArrows]);

    // Update analysis arrows with throttling
    useEffect(() => {
        updateArrows();
    }, [isAnalysisOn, currentLines, updateArrows]);

    // Handle piece click to show possible moves
    const handlePieceClick = (piece, square) => {
        selectPiece(piece, square);
    };

    // Handle piece drop to make a move
    const onPieceDrop = (sourceSquare, targetSquare, promotion) => {
        // Clear selection and dots when a move is made
        clearSelection();

        // Make the move through the game store
        return makeMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: promotion[1].toLowerCase(),
        });
    };

    // Navigation functions - simple implementations
    const firstMove = () => goToMove(-1);
    const previousMove = undo;
    const nextMove = redo;
    const lastMove = () => goToMove(Infinity);

    // Memoize square styles to prevent recalculation on every render
    // Modify the customSquareStyles to use a different approach for indicators
    const customSquareStyles = React.useMemo(() => {
        const styles = {};

        // Highlight selected piece
        if (selectedPiece) {
            styles[selectedPiece] = {
                backgroundColor: "rgb(255, 217, 102, 0.1)"
            };
        }

        // Highlight king in check
        if (kingInCheck) {
            styles[kingInCheck] = {
                backgroundColor: "rgba(255, 0, 0, 0.3)",
                boxShadow: "0 0 10px 0 rgba(255, 0, 0, 0.6)",
                borderRadius: "20%",
            };
        }

        // Add possible move indicators that will be visible even with pieces
        possibleMoves.forEach(square => {
            const isOccupied = game.piece(square) !== null;

            if (isOccupied) {
                // For squares with pieces, use a colored border
                styles[square] = {
                    ...styles[square],
                    boxShadow: "inset 0 0 0 4px rgba(0, 0, 0, 0.3)",
                    borderRadius: "50%"
                };
            } else {
                // For empty squares, use the dot indicator
                styles[square] = {
                    ...styles[square],
                    backgroundImage: "radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)",
                    backgroundPosition: "center",
                    backgroundSize: "50%",
                    backgroundRepeat: "no-repeat",
                };
            }
        });

        return styles;
    }, [selectedPiece, kingInCheck, possibleMoves, game]);

    return (
        <div
            className="flex z-0 flex-col duration-300 transition-all w-fit max-w-full gap-3"
        >
            <Chessboard
                position={game.fen()}
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