import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
    useGame,
    useGameActions,
    useGameDerivedState,
    useKingInCheck
} from './stores/useGameStore';
import { useEngineStore } from './stores/useEngineStore';

export const useChessboard = (boardWidth) => {
    // UI state
    const [orientedWhite, setOrientedWhite] = useState(true);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [customArrows, setCustomArrows] = useState([]);

    // Get game state from store
    const {
        makeMove,
        goToMove,
        undo,
        redo,
    } = useGameActions();

    const { fen, turn } = useGameDerivedState();

    const game = useGame();

    const { isAnalysisOn, currentLines } = useEngineStore();

    // Get the square of the king in check (if any)
    const kingInCheck = useKingInCheck();

    // Board settings
    const handleSetOrientedWhite = useCallback((value) => {
        setOrientedWhite(value);
    }, []);

    // Piece selection and move highlighting
    const selectPiece = useCallback((piece, square) => {
        // If the same piece is clicked again, deselect it
        if (selectedPiece === square) {
            setSelectedPiece(null);
            setPossibleMoves([]);
            return;
        }

        // Only allow piece selection if it's the current player's turn
        const isWhitePiece = piece[0] === 'w';
        const isWhiteTurn = turn === 'w';

        if (isWhitePiece !== isWhiteTurn) {
            setSelectedPiece(null);
            setPossibleMoves([]);
            return;
        }

        // Get legal moves
        const legalMoves = game.moves({ square, verbose: true }) || [];

        setSelectedPiece(square);
        setPossibleMoves(legalMoves.map(move => move.to));
    }, [selectedPiece, turn, game]);

    // Clear selection (used when move is made or board is reset)
    const clearSelection = useCallback(() => {
        setSelectedPiece(null);
        setPossibleMoves([]);
    }, []);

    // Handle piece click to show possible moves
    const handlePieceClick = useCallback((piece, square) => {
        selectPiece(piece, square);
    }, [selectPiece]);

    // Handle piece drop to make a move
    const onPieceDrop = useCallback((sourceSquare, targetSquare, promotion) => {
        // Clear selection and dots when a move is made
        clearSelection();

        // Make the move through the game store
        return makeMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: promotion ? promotion[1].toLowerCase() : undefined,
        });
    }, [clearSelection, makeMove]);

    // Stable references for currentLines and customArrows to prevent useEffect loops
    const currentLinesRef = useRef(currentLines);
    const customArrowsRef = useRef(customArrows);

    useEffect(() => {
        currentLinesRef.current = currentLines;
    }, [currentLines]);

    useEffect(() => {
        customArrowsRef.current = customArrows;
    }, [customArrows]);

    // Function to update arrows
    const updateArrows = useCallback(() => {
        // Use refs to prevent dependency issues
        const currentCustomArrows = customArrowsRef.current;
        const currentLinesData = currentLinesRef.current;

        // Only proceed if analyzing and lines exist
        if (!isAnalysisOn || !currentLinesData || currentLinesData.length === 0) {
            if (currentCustomArrows.length > 0) {
                setCustomArrows([]);
            }
            return;
        }

        try {
            // Get the best line (first line)
            const bestLine = currentLinesData[0];
            if (!bestLine || !bestLine.pvMoves || bestLine.pvMoves.length === 0) {
                if (currentCustomArrows.length > 0) {
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
            if (currentCustomArrows.length > 0) {
                setCustomArrows([]);
            }
        }
    }, [isAnalysisOn, setCustomArrows]);

    // Update analysis arrows
    useEffect(() => {
        updateArrows();
    }, [updateArrows]); // Update when lines change

    // Navigation functions
    const firstMove = useCallback(() => goToMove(-1), [goToMove]);
    const previousMove = useCallback(() => undo(), [undo]);
    const nextMove = useCallback(() => redo(), [redo]);
    const lastMove = useCallback(() => goToMove(Infinity), [goToMove]);

    // Memoize square styles to prevent recalculation on every render
    const customSquareStyles = useMemo(() => {
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
            const isThisSquareOccupied = game.pieces(square) !== null;

            if (isThisSquareOccupied) {
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

    return {
        // State
        position: fen,
        orientedWhite,
        selectedPiece,
        possibleMoves,
        customArrows,
        customSquareStyles,
        boardWidth,

        // Methods
        setOrientedWhite: handleSetOrientedWhite,
        setCustomArrows,
        selectPiece,
        clearSelection,
        handlePieceClick,
        onPieceDrop,

        // Navigation
        firstMove,
        previousMove,
        nextMove,
        lastMove
    };
};