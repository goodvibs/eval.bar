import { useEffect, useRef, useCallback } from 'react';
import { useEngineStore } from "./stores/useEngineStore";

export function useStockfish() {
    const {
        handleEngineMessage,
        multiPV,
        setIsInitialized,
    } = useEngineStore();

    const engineRef = useRef(null);

    // Initialize engine
    const initEngine = useCallback(() => {
        if (!engineRef.current) {
            try {
                console.log('Initializing Stockfish engine');
                engineRef.current = new Worker('stockfish.wasm.js');

                // Initial UCI setup
                engineRef.current.postMessage('uci');
                engineRef.current.postMessage(`setoption name MultiPV value ${multiPV}`);
                engineRef.current.postMessage('isready');
                engineRef.current.postMessage('ucinewgame');

                // Listen for engine messages
                console.log('Waiting for readyok message');

                engineRef.current.addEventListener('message', (e) => {
                    // Handle "readyok" message to update engine ready state
                    if (e.data === "readyok") {
                        setIsInitialized(true);
                        console.log('readyok received, Stockfish is ready');
                    }

                    handleEngineMessage(e.data);
                });

                // Expose engine to window for direct store access
                window.stockfish = engineRef.current;

                return true;
            } catch (error) {
                console.error('Failed to initialize Stockfish engine:', error);
                setIsInitialized(false);
                return false;
            }
        }
        return true;
    }, [handleEngineMessage, multiPV, setIsInitialized]);

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
                setIsInitialized(false);
            }
        };
    }, [initEngine, setIsInitialized]);

    // No need to return anything - the store will handle engine commands
}