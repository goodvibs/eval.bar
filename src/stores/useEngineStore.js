import { create } from 'zustand';
import {useGameStore} from "./gameStore";
import {Chess} from "chess.js";

export const useEngineStore = create((set, get) => ({
    isAnalyzing: false,
    depth: 0,
    multipv: 3,
    currentLines: [],
    engineThinking: '',

    handleEngineMessage: (message) => {
        if (!message.includes('info') || !message.includes('score') || !message.includes('pv')) {
            return;
        }

        console.log('Processing engine message:', message);

        try {
            const state = get();
            let lines = [...state.currentLines];

            // Extract multipv index
            const multipvMatch = message.match(/multipv (\d+)/);
            if (!multipvMatch) return;

            const lineIndex = parseInt(multipvMatch[1]) - 1;

            // Extract depth
            const depthMatch = message.match(/depth (\d+)/);
            if (depthMatch) {
                set({ depth: parseInt(depthMatch[1]) });
            }

            // Extract score
            let score = 0;
            const mateMatch = message.match(/score mate (-?\d+)/);
            const cpMatch = message.match(/score cp (-?\d+)/);

            if (mateMatch) {
                const mateIn = parseInt(mateMatch[1]);
                score = mateIn > 0 ? `M${mateIn}` : `-M${Math.abs(mateIn)}`;
            } else if (cpMatch) {
                score = parseInt(cpMatch[1]) / 100;
            }

            // Extract and validate moves using chess.js
            const pvIndex = message.indexOf(' pv ') + 4;
            let movesStr = message.slice(pvIndex).split(' ');

            // Create a new chess instance from current position
            const chess = new Chess(useGameStore.getState().currentFen);

            // Try to make each move and collect valid ones
            const validMoves = [];
            for (const moveUCI of movesStr) {
                try {
                    // Convert UCI move (e2e4) to move object
                    const from = moveUCI.slice(0, 2);
                    const to = moveUCI.slice(2, 4);
                    const promotion = moveUCI[4]; // Might be undefined

                    const move = chess.move({
                        from,
                        to,
                        promotion: promotion?.toLowerCase()
                    });

                    if (move) {
                        validMoves.push(move.san); // Store standard algebraic notation
                    }
                } catch (e) {
                    // Invalid move, stop processing this line
                    break;
                }
            }

            console.log('Valid moves:', validMoves);

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
    },

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

    setMultiPV: (value) => {
        console.log('Setting MultiPV to:', value);
        set({ multipv: value });
        const { isAnalyzing } = get();
        if (isAnalyzing) {
            get().stopAnalysis();
            setTimeout(() => get().startAnalysis(), 100);
        }
    },
}));