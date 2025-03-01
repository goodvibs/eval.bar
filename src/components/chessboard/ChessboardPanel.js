import { Chessboard } from "react-chessboard";
import { ChessboardControls } from "./ChessboardControls";
import React, { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "../../hooks/stores/useGameStore";
import { useEngineStore } from "../../hooks/stores/useEngineStore";
import { useChessboardStore } from "../../hooks/stores/useChessboardStore";
import { useBoardResize } from "../../hooks/useBoardResize";
import { Chess } from "cm-chess";

// Configure the throttling value - only update arrows this often at maximum
const ARROW_UPDATE_THROTTLE = 300; // milliseconds

export function ChessboardPanel() {
    // Get game state
    const {
        game,
        makeMove,
        goToMove,
        undo,
        redo,
        gameMetadata,
        isKingInCheck,
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

    // Use refs to track state and timing for throttling
    const updateTimeoutRef = useRef(null);
    const lastArrowUpdateRef = useRef(0);
    const chessInstanceRef = useRef(new Chess()); // Reuse chess instance for performance

    // Function to update arrows - this needs useCallback as it's a dependency in useEffect
    const updateArrows = useCallback(() => {
        // Only proceed if analyzing and lines exist
        if (!isAnalyzing || !currentLines || currentLines.length === 0) {
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

            // Load current position
            chessInstanceRef.current.load(game.fen());

            // Get the first move in the best line
            const sanMove = bestLine.moves[0];

            // Convert SAN to move object with from/to
            const moveObj = chessInstanceRef.current.move(sanMove);
            if (!moveObj) {
                if (customArrows.length > 0) {
                    setCustomArrows([]);
                }
                return;
            }

            // Create new arrow array
            const newArrows = [[moveObj.from, moveObj.to, "#285b8d"]];

            setCustomArrows(newArrows);
        } catch (e) {
            console.error("Error setting best move arrow:", e);
            if (customArrows.length > 0) {
                setCustomArrows([]);
            }
        }
    }, [isAnalyzing, currentLines, game, customArrows, setCustomArrows]);

    // Update analysis arrows with throttling
    useEffect(() => {
        // Clear any pending timeout
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
            updateTimeoutRef.current = null;
        }

        // Check if we need to throttle
        const now = Date.now();
        const timeSinceLastUpdate = now - lastArrowUpdateRef.current;

        if (timeSinceLastUpdate < ARROW_UPDATE_THROTTLE) {
            // We updated too recently, schedule a deferred update
            updateTimeoutRef.current = setTimeout(() => {
                lastArrowUpdateRef.current = Date.now();
                updateArrows();
            }, ARROW_UPDATE_THROTTLE - timeSinceLastUpdate);
        } else {
            // Enough time has passed, update immediately
            lastArrowUpdateRef.current = now;
            updateArrows();
        }

        // Cleanup on unmount
        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [isAnalyzing, currentLines, updateArrows]);

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

        // Add possible move indicators
        possibleMoves.forEach(square => {
            styles[square] = {
                backgroundImage: "radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)",
                backgroundPosition: "center",
                backgroundSize: "50%",
                backgroundRepeat: "no-repeat",
            };
        });

        return styles;
    }, [selectedPiece, kingInCheck, possibleMoves]);

    return (
        <div
            ref={containerRef}
            className="flex z-0 flex-col duration-300 transition-all w-fit max-w-full border-slate-500 border rounded-lg p-2 pb-0"
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