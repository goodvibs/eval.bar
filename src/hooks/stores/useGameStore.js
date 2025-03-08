import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { Chess } from 'cm-chess';
import { Pgn } from 'cm-pgn/src/Pgn';

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

// Create the base store without helper methods
const useGameStore = create((set, get) => ({
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
        event: null,
    },

    // Actions that modify state
    makeMove: move => {
        const { game } = get();
        const moveResult = game.move(move);

        if (moveResult) {
            set({
                game,
                pgn: clonePgn(game.pgn),
            });
            return true;
        }
        return false;
    },

    undo: () => {
        const { game } = get();
        if (game.history().length === 0) {
            return;
        }
        game.undo();
        set({ game });
    },

    redo: () => {
        const { game, pgn } = get();
        const currentPly = game.plyCount();
        const nextMove = pgn.history.moves[currentPly];

        if (nextMove) {
            game.move(nextMove);
            set({ game });
        }
    },

    goToMove: index => {
        const { pgn } = get();
        const moveHistory = pgn.history.moves;
        const moveCount = moveHistory.length;

        const newGame = new Chess();
        if (index >= 0) {
            const correctedIndex = Math.min(index, moveCount - 1);
            for (let i = 0; i <= correctedIndex; i++) {
                newGame.move(moveHistory[i]);
            }
        }

        set({ game: newGame });
    },

    loadChesscomGame: chesscomGame => {
        try {
            if (!chesscomGame.isSupported) {
                return false;
            }

            const newGame = new Chess();
            newGame.loadPgn(processPgn(chesscomGame.pgn));

            set({
                game: newGame,
                pgn: clonePgn(newGame.pgn),
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
                    event: chesscomGame.event,
                },
            });
            return true;
        } catch (error) {
            throw Error('Failed to load game: ' + error.message);
        }
    },

    loadPgnGame: pgnString => {
        try {
            const newGame = new Chess();
            newGame.loadPgn(processPgn(pgnString));

            set({
                game: newGame,
                pgn: clonePgn(newGame.pgn),
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
                    event: null,
                },
            });
            return true;
        } catch (error) {
            throw Error('Failed to load game: ' + error.message);
        }
    },
}));

// ========== GROUPED SELECTORS ==========

export const useGame = () => useGameStore(useShallow(state => state.game));

export const useGameDerivedState = () =>
    useGameStore(
        useShallow(state => ({
            turn: state.game.turn(),
            fen: state.game.fen(),
            inCheck: state.game.inCheck(),
            halfmoveCount: state.game.plyCount(),
            fullmoveCount: Math.floor((state.game.plyCount() - 1) / 2) + 1,
            moves: state.game.history(),
        }))
    );

export const usePgn = () => useGameStore(useShallow(state => state.pgn));

export const usePgnDerivedState = () =>
    useGameStore(
        useShallow(state => ({
            moves: state.pgn.history.moves,
            fullmoveCount: Math.floor((state.pgn.history.moves.length - 1) / 2) + 1,
            pgnText: state.pgn.render(false, false, false),
        }))
    );

export const useGameMetadata = () => useGameStore(useShallow(state => state.gameMetadata));

// Action selectors - for components that only need actions
export const useGameActions = () =>
    useGameStore(
        useShallow(state => ({
            makeMove: state.makeMove,
            undo: state.undo,
            redo: state.redo,
            goToMove: state.goToMove,
        }))
    );

export const useLoadGame = () =>
    useGameStore(
        useShallow(state => ({
            loadChesscomGame: state.loadChesscomGame,
            loadPgnGame: state.loadPgnGame,
        }))
    );

// Finding the king in check - the implementation stays outside the selector body
export const findKingInCheck = game => {
    if (!game.inCheck()) return null;

    const turn = game.turn();

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
};

// Since this returns a primitive (string or null), useShallow is not needed
export const useKingInCheck = () => useGameStore(state => findKingInCheck(state.game));
