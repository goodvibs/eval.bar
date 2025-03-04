import { useState, useCallback } from 'react';
import { useGameStore } from './stores/useGameStore';

export const useChessboard = () => {
    // UI state
    const [orientedWhite, setOrientedWhite] = useState(true);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [customArrows, setCustomArrows] = useState([]);

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
        const isWhiteTurn = useGameStore.getState().getCurrentTurn() === 'w';

        if (isWhitePiece !== isWhiteTurn) {
            setSelectedPiece(null);
            setPossibleMoves([]);
            return;
        }

        // Get legal moves from game store
        const legalMoves = useGameStore.getState().getLegalMovesForSquare(square);

        setSelectedPiece(square);
        setPossibleMoves(legalMoves.map(move => move.to));
    }, [selectedPiece]);

    // Clear selection (used when move is made or board is reset)
    const clearSelection = useCallback(() => {
        setSelectedPiece(null);
        setPossibleMoves([]);
    }, []);

    return {
        // State
        orientedWhite,
        selectedPiece,
        possibleMoves,
        customArrows,

        // Methods
        setOrientedWhite: handleSetOrientedWhite,
        setCustomArrows,
        selectPiece,
        clearSelection
    };
};