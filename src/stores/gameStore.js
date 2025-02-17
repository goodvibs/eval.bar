import { create } from 'zustand';
import {Chess} from 'cm-chess';
import {extractPgnHeaders, isSupportedVariant} from "../utils/chesscom";

function processPgn(pgn) {
    pgn = pgn.trimEnd();
    const resultRegex = /^(1-0|0-1|1\/2-1\/2)$/g;
    const resultMatch = pgn.match(resultRegex);
    if (resultMatch) {
        pgn = pgn.replace(resultRegex, '');
    }
    return pgn.trimEnd();
}

export const useGameStore = create((set, get) => ({
    game: new Chess(),
    gamePgn: '',
    gameMoveHistory: [],

    currentMoveIndex: -1,
    currentPositionFen: new Chess().fen(),
    currentPositionAnalysis: {
        depth: 0,
        evaluation: 0,
        isAnalyzing: false,
        lines: []
    },

    gameMetadata: {
        white: '',
        black: '',
        date: '',
        event: '',
        result: ''
    },

    makeMove: (move) => {
        const { game } = get();
        const result = game.move(move);

        let moveHistory = get().gameMoveHistory;
        let currentMoveIndex = get().currentMoveIndex;

        if (result) {
            if (currentMoveIndex !== moveHistory.length - 1) {
                // Remove all moves after the current index
                moveHistory = moveHistory.slice(0, currentMoveIndex + 1);
            }
            set({
                currentPositionFen: game.fen(),
                gamePgn: game.pgn,
                gameMoveHistory: [...moveHistory, result],
                currentMoveIndex: currentMoveIndex + 1
            });
            return true;
        }
        return false;
    },

    undo: () => {
        const { game, currentMoveIndex } = get();
        if (currentMoveIndex > -1) {
            game.undo();
            set({
                currentPositionFen: game.fen(),
                currentMoveIndex: currentMoveIndex - 1
            });
        }
    },

    redo: () => {
        const { game, gameMoveHistory, currentMoveIndex } = get();
        if (currentMoveIndex < gameMoveHistory.length - 1) {
            const move = gameMoveHistory[currentMoveIndex + 1];
            game.move(move);
            set({
                currentPositionFen: game.fen(),
                currentMoveIndex: currentMoveIndex + 1
            });
        }
    },

    goToMove: (index) => {
        let {game, currentMoveIndex, gameMoveHistory} = get();

        while (currentMoveIndex < index) {
            game.move(gameMoveHistory[currentMoveIndex + 1]);
            currentMoveIndex++;
        }

        while (currentMoveIndex > index) {
            game.undo();
            currentMoveIndex--;
        }

        set({
            currentPositionFen: game.fen(),
            currentMoveIndex
        });

        return true;
    },

    // Load a game from PGN
    loadGame: (pgn) => {
        try {
            if (!pgn) {
                throw new Error('No PGN provided');
            }

            // Extract headers first
            const headers = extractPgnHeaders(pgn);

            // Validate variant before proceeding
            if (!isSupportedVariant(headers)) {
                return false;
            }

            // Process and load the game
            pgn = processPgn(pgn);
            const newGame = new Chess();

            newGame.loadPgn(pgn);
            const moves = newGame.history();

            set({
                game: newGame,
                currentPositionFen: newGame.fen(),
                gamePgn: newGame.pgn,
                gameMoveHistory: moves,
                currentMoveIndex: moves.length - 1,
                gameMetadata: {
                    white: headers.White || '',
                    black: headers.Black || '',
                    date: headers.Date || '',
                    event: headers.Event || '',
                    result: headers.Result || '',
                    // You can add more metadata fields here if needed:
                    timeControl: headers.TimeControl || '',
                    whiteElo: headers.WhiteElo || '',
                    blackElo: headers.BlackElo || '',
                    eco: headers.ECO || ''
                }
            });
            return true;
        } catch (error) {
            // More specific error messages
            console.error('Failed to load game:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Reset to starting position
    resetGame: () => {
        const newGame = new Chess();
        set({
            game: newGame,
            currentPositionFen: newGame.fen(),
            gamePgn: '',
            gameMoveHistory: [],
            currentMoveIndex: -1,
            gameMetadata: {
                white: '',
                black: '',
                date: '',
                event: '',
                result: ''
            }
        });
    }
}));