import { create } from 'zustand';
import { Chess } from 'chess.js';

export const useGameStore = create((set, get) => ({
    game: new Chess(),
    currentFen: new Chess().fen(),
    currentPgn: '',
    moveHistory: [],
    currentMoveIndex: -1,
    analysis: {
        depth: 0,
        evaluation: 0,
        isAnalyzing: false,
        lines: []
    },
    metadata: {
        white: '',
        black: '',
        date: '',
        event: '',
        result: ''
    },

    // Game actions
    makeMove: (move) => {
        const { game } = get();
        const result = game.move(move);

        if (result) {
            set({
                currentFen: game.fen(),
                currentPgn: game.pgn(),
                moveHistory: [...get().moveHistory, result],
                currentMoveIndex: get().currentMoveIndex + 1
            });
            return true;
        }
        return false;
    },

    // Load a game from PGN
    loadGame: (pgn) => {
        const newGame = new Chess();
        try {
            newGame.loadPgn(pgn);
            const moves = newGame.history({ verbose: true });

            set({
                game: newGame,
                currentFen: newGame.fen(),
                currentPgn: newGame.pgn(),
                moveHistory: moves,
                currentMoveIndex: moves.length - 1,
                metadata: {
                    white: newGame.header()['White'] || '',
                    black: newGame.header()['Black'] || '',
                    date: newGame.header()['Date'] || '',
                    event: newGame.header()['Event'] || '',
                    result: newGame.header()['Result'] || ''
                }
            });
            return true;
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    },

    // Reset to starting position
    resetGame: () => {
        const newGame = new Chess();
        set({
            game: newGame,
            currentFen: newGame.fen(),
            currentPgn: '',
            moveHistory: [],
            currentMoveIndex: -1,
            metadata: {
                white: '',
                black: '',
                date: '',
                event: '',
                result: ''
            }
        });
    }
}));