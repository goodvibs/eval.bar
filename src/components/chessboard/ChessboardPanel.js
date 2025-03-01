import { Chessboard } from "react-chessboard";
import { ChessboardControls } from "./ChessboardControls";
import React, { useEffect, useRef } from "react";
import { useGameStore } from "../../hooks/stores/useGameStore";
import { useEngineStore } from "../../hooks/stores/useEngineStore";
import { useChessboardStore } from "../../hooks/stores/useChessboardStore";
import { useBoardResize } from "../../hooks/useBoardResize";
import { Chess } from "cm-chess";

export function ChessboardPanel() {
    const {
        currentPositionFen,
        makeMove,
        goToMove,
        undo,
        redo,
        gameMetadata,
        currentMoveIndex,
        gameMoveHistory,
        isKingInCheck
    } = useGameStore();

    // Get engine state
    const { isAnalyzing, currentLines } = useEngineStore();

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

    // Use the custom hook for board resizing
    const { containerRef, boardWidth } = useBoardResize({ gameMetadata });

    // Get the square of the king in check (if any)
    const kingInCheck = isKingInCheck();

    // Use refs to track previous values and avoid unnecessary updates
    const updateTimeoutRef = useRef(null);

    // Update analysis arrows when relevant states change
    useEffect(() => {
        // Clear any pending timeout to avoid duplicate updates
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        // Only update arrows if analyzing and there are lines
        if (!isAnalyzing || !currentLines || currentLines.length === 0) {
            setCustomArrows([]);
            return;
        }

        // Delay the arrow update slightly to batch potential state changes
        updateTimeoutRef.current = setTimeout(() => {
            try {
                // Get the best line (first line)
                const bestLine = currentLines[0];
                if (!bestLine || !bestLine.moves || bestLine.moves.length === 0) {
                    setCustomArrows([]);
                    return;
                }

                // Process the next move as an arrow
                const tempChess = new Chess(currentPositionFen);
                const sanMove = bestLine.moves[0];

                // Convert SAN to move object with from/to
                const moveObj = tempChess.move(sanMove);
                if (!moveObj) {
                    setCustomArrows([]);
                    return;
                }

                // Create arrow from best move with blue color
                setCustomArrows([[moveObj.from, moveObj.to, "#285b8d"]]);
            } catch (e) {
                console.error("Error setting best move arrow:", e);
                setCustomArrows([]);
            }
        }, 50); // Short delay to batch updates

        // Cleanup timeout on unmount
        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [isAnalyzing, currentLines, currentPositionFen, setCustomArrows]);

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

    // Navigation functions
    const firstMove = () => goToMove(-1);
    const previousMove = () => currentMoveIndex > -1 && undo();
    const nextMove = () => currentMoveIndex < gameMoveHistory.length - 1 && redo();
    const lastMove = () => goToMove(gameMoveHistory.length > 0 ? gameMoveHistory.length - 1 : 0);

    return (
        <div
            ref={containerRef}
            className="flex z-0 flex-col duration-300 transition-all w-fit max-w-full border-slate-500 border rounded-lg p-2 pb-0"
        >
            <Chessboard
                position={currentPositionFen}
                boardWidth={boardWidth}
                customLightSquareStyle={{ backgroundColor: "#e1dfcb" }}
                customDarkSquareStyle={{ backgroundColor: "#648b67" }}
                boardOrientation={orientedWhite ? "white" : "black"}
                onPieceDrop={onPieceDrop}
                onPieceClick={handlePieceClick}
                onPieceDragBegin={handlePieceClick} // Reuse the same handler
                customArrows={customArrows}
                customSquareStyles={{
                    // Highlight selected piece with a consistent color
                    ...(selectedPiece && {
                        [selectedPiece]: {
                            backgroundColor: "rgb(255, 217, 102, 0.1)"
                        }
                    }),
                    // Highlight king in check with a red background
                    ...(kingInCheck && {
                        [kingInCheck]: {
                            backgroundColor: "rgba(255, 0, 0, 0.3)",
                            boxShadow: "0 0 10px 0 rgba(255, 0, 0, 0.6)",
                            borderRadius: "20%",
                        }
                    }),
                    // Highlight possible moves with consistent dots
                    ...Object.fromEntries(
                        possibleMoves.map(square => [
                            square,
                            {
                                // Use the same background color for all move indicators
                                backgroundImage: "radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)",
                                backgroundPosition: "center",
                                backgroundSize: "50%",
                                backgroundRepeat: "no-repeat",
                            }
                        ])
                    )
                }}
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