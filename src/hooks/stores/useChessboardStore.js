import { create } from 'zustand';
import { useGameStore } from './useGameStore';

export const useChessboardStore = create((set, get) => ({
    // UI state
    orientedWhite: true,
    selectedPiece: null,
    possibleMoves: [],
    customArrows: [],

    // Board settings
    setOrientedWhite: (value) => {
        set({ orientedWhite: value });
    },

    // Direct state updates
    setCustomArrows: (arrows) => {
        set({ customArrows: arrows });
    },

    // Piece selection and move highlighting
    selectPiece: (piece, square) => {
        const { selectedPiece } = get();

        // If the same piece is clicked again, deselect it
        if (selectedPiece === square) {
            set({
                selectedPiece: null,
                possibleMoves: []
            });
            return;
        }

        // Only allow piece selection if it's the current player's turn
        const isWhitePiece = piece[0] === 'w';
        const isWhiteTurn = useGameStore.getState().getCurrentTurn() === 'w';

        if (isWhitePiece !== isWhiteTurn) {
            set({
                selectedPiece: null,
                possibleMoves: []
            });
            return;
        }

        // Get legal moves from game store
        const legalMoves = useGameStore.getState().getLegalMovesForSquare(square);

        set({
            selectedPiece: square,
            possibleMoves: legalMoves.map(move => move.to)
        });
    },

    // Clear selection (used when move is made or board is reset)
    clearSelection: () => {
        set({
            selectedPiece: null,
            possibleMoves: []
        });
    }
}));