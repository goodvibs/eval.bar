import { useEffect } from 'react';
import {useEngineStore} from "../stores/useEngineStore";

export function useStockfish() {
    const { handleEngineMessage } = useEngineStore();

    useEffect(() => {
        if (!window.stockfish) {
            window.stockfish = new Worker('stockfish.wasm.js');

            // Initial UCI setup
            window.stockfish.postMessage('uci');
            window.stockfish.postMessage('setoption name MultiPV value 3');
            window.stockfish.postMessage('isready');
            window.stockfish.postMessage('ucinewgame');

            window.stockfish.addEventListener('message', (e) => {
                handleEngineMessage(e.data);
            });
        }

        return () => {
            if (window.stockfish) {
                window.stockfish.terminate();
                window.stockfish = null;
            }
        };
    }, [handleEngineMessage]);
}