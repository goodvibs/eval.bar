import { useEffect, useRef, useCallback } from 'react';
import { useEngineStore } from "./stores/useEngineStore";

export function useStockfish() {
    const {
        handleEngineMessage,
        multipv,
        setEngineReady
    } = useEngineStore();

    const engineRef = useRef(null);

    // Initialize engine
    const initEngine = useCallback(() => {
        if (!engineRef.current) {
            try {
                engineRef.current = new Worker('stockfish.wasm.js');

                // Initial UCI setup
                engineRef.current.postMessage('uci');
                engineRef.current.postMessage(`setoption name MultiPV value ${multipv}`);
                engineRef.current.postMessage('isready');
                engineRef.current.postMessage('ucinewgame');

                engineRef.current.addEventListener('message', (e) => {
                    // Handle "readyok" message to update engine ready state
                    if (e.data === "readyok") {
                        setEngineReady(true);
                    }

                    handleEngineMessage(e.data);
                });

                // Expose engine to window for direct store access
                window.stockfish = engineRef.current;

                return true;
            } catch (error) {
                console.error('Failed to initialize Stockfish engine:', error);
                setEngineReady(false);
                return false;
            }
        }
        return true;
    }, [handleEngineMessage, multipv, setEngineReady]);

    useEffect(() => {
        // Initialize engine on component mount
        initEngine();

        // Cleanup function to terminate engine on unmount
        return () => {
            if (engineRef.current) {
                engineRef.current.terminate();
                engineRef.current = null;

                // Clean up window reference
                window.stockfish = null;
                setEngineReady(false);
            }
        };
    }, [initEngine, setEngineReady]);

    // No need to return anything - the store will handle engine commands
}