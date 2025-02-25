import { useEffect, useRef, useCallback } from 'react';
import { useEngineStore } from "../stores/useEngineStore";

export function useStockfish(options = { multiPV: 3 }) {
    const { handleEngineMessage } = useEngineStore();
    const engineRef = useRef(null);

    // Initialize engine with configurable options
    const initEngine = useCallback(() => {
        if (!engineRef.current) {
            try {
                engineRef.current = new Worker('stockfish.wasm.js');

                // Initial UCI setup
                engineRef.current.postMessage('uci');
                engineRef.current.postMessage(`setoption name MultiPV value ${options.multiPV}`);
                engineRef.current.postMessage('isready');
                engineRef.current.postMessage('ucinewgame');

                engineRef.current.addEventListener('message', (e) => {
                    handleEngineMessage(e.data);
                });

                // Expose engine to window for debugging only in development
                if (process.env.NODE_ENV === 'development') {
                    window.stockfish = engineRef.current;
                }

                return true;
            } catch (error) {
                console.error('Failed to initialize Stockfish engine:', error);
                return false;
            }
        }
        return true;
    }, [handleEngineMessage, options.multiPV]);

    // Send command to engine
    const sendCommand = useCallback((command) => {
        if (engineRef.current) {
            engineRef.current.postMessage(command);
            return true;
        }
        return false;
    }, []);

    // Reset engine (for new games)
    const resetEngine = useCallback(() => {
        if (engineRef.current) {
            sendCommand('ucinewgame');
            return true;
        }
        return false;
    }, [sendCommand]);

    useEffect(() => {
        // Initialize engine on component mount
        initEngine();

        // Cleanup function to terminate engine on unmount
        return () => {
            if (engineRef.current) {
                engineRef.current.terminate();
                engineRef.current = null;

                // Clean up window reference if it exists
                if (window.stockfish) {
                    window.stockfish = null;
                }
            }
        };
    }, [initEngine]);

    // Return useful methods for interacting with the engine
    return {
        sendCommand,
        resetEngine,
        isReady: !!engineRef.current
    };
}