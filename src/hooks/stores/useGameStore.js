import { create } from 'zustand';
import {Chess, FEN} from 'cm-chess';
import {Pgn} from "cm-pgn/src/Pgn";
import {useEngineStore} from "./useEngineStore";

function processPgn(pgn) {
    pgn = pgn.trimEnd();
    const resultRegex = /^(1-0|0-1|1\/2-1\/2)$/g;
    const resultMatch = pgn.match(resultRegex);
    if (resultMatch) {
        pgn = pgn.replace(resultRegex, '');
    }
    return pgn.trimEnd();
}

function clonePgn(pgn) {
    return new Pgn(pgn.render(false, false, false));
}

export const useGameStore = create((set, get) => ({
    game: new Chess(), // represents the current game state
    pgn: new Pgn(), // represents the overall PGN, which may not match the current game state

    gameMetadata: {
        white: null,
        black: null,
        date: null,
        result: null,
        timeControl: null,
        whiteElo: null,
        blackElo: null,
        eco: null,
        opening: null,
        variant: null,
        finalPosition: null,
        url: null,
        event: null
    },

    isKingInCheck: () => {
        const { game } = get();
        if (!game.inCheck()) return null;

        const turn = game.turn();

        // Find the king's position
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = String.fromCharCode(97 + col) + (8 - row);
                const piece = game.piece(square);
                if (piece && piece.type === 'k' && piece.color === turn) {
                    return square;
                }
            }
        }
        return null;
    },

    getLegalMovesForSquare: (square) => {
        const { game } = get();
        return game.moves({ square, verbose: true });
    },

    getCurrentTurn: () => {
        return get().game.turn();
    },

    makeMove: (move) => {
        let { game } = get();
        const moveResult = game.move(move);

        if (moveResult) {
            set({
                game: game,
                pgn: clonePgn(game.pgn),
            });
            return true;
        }

        return false;

    },

    undo: () => {
        let { game } = get();
        if (game.history().length === 0) {
            return;
        }
        game.undo();

        set({
            game: game,
        });
    },

    redo: () => {
        let { game, pgn } = get();
        const currentPly = game.plyCount();
        const nextMove = pgn.history.moves[currentPly];
        game.move(nextMove);

        set({
            game: game,
        });
    },

    goToMove: (index) => {
        const { pgn } = get();

        const moveHistory = pgn.history.moves;
        const moveCount = moveHistory.length;

        let game = new Chess();

        if (index >= 0) {
            const correctedIndex = Math.min(index, moveCount - 1);
            for (let i = 0; i <= correctedIndex; i++) {
                game.move(moveHistory[i]);
            }
        }

        set({
            game: game,
        });
    },

    // Load a game from PGN
    loadChesscomGame: (chesscomGame) => {
        try {
            if (!chesscomGame.isSupported) {
                return false;
            }

            // Process and load the game
            let game = new Chess();

            game.loadPgn(processPgn(chesscomGame.pgn));

            set({
                game: game,
                pgn: clonePgn(game.pgn),
                gameMetadata: {
                    white: chesscomGame.white,
                    black: chesscomGame.black,
                    date: chesscomGame.date,
                    result: chesscomGame.result,
                    timeControl: chesscomGame.timeControl,
                    whiteElo: chesscomGame.whiteElo,
                    blackElo: chesscomGame.blackElo,
                    eco: chesscomGame.ECO,
                    opening: chesscomGame.opening,
                    variant: chesscomGame.variant,
                    finalPosition: chesscomGame.fen,
                    url: chesscomGame.url,
                    event: chesscomGame.event
                }
            });
        } catch (error) {
            throw Error('Failed to load game: ' + error.message);
        }
    },

    loadPgnGame: (pgnString) => {
        try {
            let game = new Chess();
            game.loadPgn(processPgn(pgnString));

            set({
                game: game,
                pgn: clonePgn(game.pgn),
                gameMetadata: {
                    white: null,
                    black: null,
                    date: null,
                    result: null,
                    timeControl: null,
                    whiteElo: null,
                    blackElo: null,
                    eco: null,
                    opening: null,
                    variant: null,
                    finalPosition: null,
                    url: null,
                    event: null
                }
            });
        } catch (error) {
            throw Error('Failed to load game: ' + error.message);
        }
    },

    getCurrentHalfmoveCount: () => {
        return get().game.plyCount();
    },

    getCurrentFullmove: () => {
        return Math.floor(get().getCurrentHalfmoveCount() / 2) + 1;
    },

    getPgnHalfmoveCount: () => {
        return get().pgn.history.moves.length;
    },

    getPgnFullmoveCount: () => {
        return Math.floor(get().getPgnHalfmoveCount() - 1 / 2) + 1;
    },

    renderPgn: () => get().pgn.render(false, false, false),

    uciTillNow: () => {
        alert(get().game.history().map(move => move.uci))
        return get().game.history().map(move => move.uci);
    }
}));