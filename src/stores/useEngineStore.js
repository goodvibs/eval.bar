import { create } from 'zustand';
import {useGameStore} from "./gameStore";

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

    setMultiPV: (value) => {
        console.log('Setting MultiPV to:', value);
        set({ multipv: value });
        const { isAnalyzing } = get();
        if (isAnalyzing) {
            get().stopAnalysis();
            setTimeout(() => get().startAnalysis(), 100);
        }
    },

    handleEngineMessage: (message) => {
        // Only process info messages containing score and pv
        if (!message.includes('info') || !message.includes('score') || !message.includes('pv')) {
            return;
        }

        console.log('Processing engine message:', message);

        try {
            const state = get();
            let lines = [...state.currentLines];

            // Extract multipv index
            const multipvMatch = message.match(/multipv (\d+)/);
            if (!multipvMatch) {
                console.log('No multipv found in message');
                return;
            }

            const lineIndex = parseInt(multipvMatch[1]) - 1;
            console.log('Line index:', lineIndex);

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

            console.log('Parsed score:', score);

            // Extract moves - Fixed regex
            const pvIndex = message.indexOf(' pv ') + 4;
            let movesStr = message.slice(pvIndex);
            // Cut off at the next info field if it exists
            const nextInfoIndex = movesStr.indexOf(' info ');
            if (nextInfoIndex !== -1) {
                movesStr = movesStr.slice(0, nextInfoIndex);
            }
            // Split moves and clean up
            const moves = movesStr.split(' ').filter(m =>
                // Valid move format: e2e4, e7e5, g1f3, etc.
                m.length === 4 &&
                m[0] >= 'a' && m[0] <= 'h' &&
                m[1] >= '1' && m[1] <= '8' &&
                m[2] >= 'a' && m[2] <= 'h' &&
                m[3] >= '1' && m[3] <= '8'
            );

            console.log('Parsed moves:', moves);

            // Create or update line
            lines[lineIndex] = {
                score,
                moves,
                depth: state.depth
            };

            console.log('Updating lines:', lines);
            set({
                currentLines: lines,
                engineThinking: message
            });
        } catch (error) {
            console.error('Error processing engine message:', error);
        }
    }
}));