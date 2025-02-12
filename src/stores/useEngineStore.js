import { create } from 'zustand';
import {useGameStore} from "./gameStore";
import {Chess} from "chess.js";

export const useEngineStore = create((set, get) => ({
    isAnalyzing: false,
    depth: 0,
    multipv: 3,
    currentLines: [],
    engineThinking: '',

    startAnalysis: () => {
        const { multipv } = get();
        console.log('Starting analysis with MultiPV:', multipv);
        set({ isAnalyzing: true, currentLines: [] });

        window.stockfish?.postMessage('setoption name MultiPV value ' + multipv);
        window.stockfish?.postMessage('position fen ' + useGameStore.getState().currentFen);
        window.stockfish?.postMessage('go depth 30');
    },

    stopAnalysis: () => {
        console.log('Stopping analysis');
        set({ isAnalyzing: false });
        window.stockfish?.postMessage('stop');
    },

    updatePosition: (fen) => {
        const { isAnalyzing } = get();
        if (!isAnalyzing) return;

        // Stop current analysis, update position, and restart
        window.stockfish?.postMessage('stop');
        window.stockfish?.postMessage('position fen ' + fen);
        window.stockfish?.postMessage('go depth 30');
    },

    handleEngineMessage: (message) => {
        if (!message.includes('info') || !message.includes('score') || !message.includes('pv')) {
            return;
        }

        try {
            const state = get();
            let lines = [...state.currentLines];
            const currentFen = useGameStore.getState().currentFen;
            const chess = new Chess(currentFen);
            const isBlackToMove = chess.turn() === 'b';

            // Extract multipv index
            const multipvMatch = message.match(/multipv (\d+)/);
            if (!multipvMatch) return;

            const lineIndex = parseInt(multipvMatch[1]) - 1;

            // Extract depth
            const depthMatch = message.match(/depth (\d+)/);
            if (depthMatch) {
                set({ depth: parseInt(depthMatch[1]) });
            }

            // Extract and adjust score based on turn
            let score = 0;
            const mateMatch = message.match(/score mate (-?\d+)/);
            const cpMatch = message.match(/score cp (-?\d+)/);

            if (mateMatch) {
                const mateIn = parseInt(mateMatch[1]);
                score = mateIn > 0 ? `M${mateIn}` : `-M${Math.abs(mateIn)}`;
                if (isBlackToMove && typeof score === 'string') {
                    score = score.startsWith('M') ? `-M${score.slice(1)}` : `M${score.slice(2)}`;
                }
            } else if (cpMatch) {
                score = parseInt(cpMatch[1]) / 100;
                if (isBlackToMove) {
                    score = -score;
                }
            }

            // Extract PV (moves)
            const pvIndex = message.indexOf(' pv ') + 4;
            let movesStr = message.slice(pvIndex).split(' ');

            // Create a new chess instance from current position and validate moves
            const validMoves = [];
            const validateChess = new Chess(currentFen);
            for (const moveUCI of movesStr) {
                try {
                    const from = moveUCI.slice(0, 2);
                    const to = moveUCI.slice(2, 4);
                    const promotion = moveUCI[4];

                    const move = validateChess.move({
                        from,
                        to,
                        promotion: promotion?.toLowerCase()
                    });

                    if (move) {
                        validMoves.push(move.san);
                    }
                } catch (e) {
                    break;
                }
            }

            // Update the line
            lines[lineIndex] = {
                score,
                moves: validMoves,
                depth: state.depth
            };

            set({
                currentLines: lines,
                engineThinking: message
            });
        } catch (error) {
            console.error('Error processing engine message:', error);
        }
    }
}));