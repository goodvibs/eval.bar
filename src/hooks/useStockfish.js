import { useEffect, useRef } from 'react';
import { useEngineStore } from "./stores/useEngineStore";

// Create a module-level variable to track if the engine has been initialized
// This ensures initialization happens only once across the application
let stockfishInitialized = false;

export function useStockfish() {
    console.log('useStockfish');
    const engineRef = useRef(null);

    const engineStore = useEngineStore.getState();

    useEffect(() => {
        // Only initialize if not already done
        if (!stockfishInitialized) {
            console.log('Initializing Stockfish engine');

            try {
                engineRef.current = new Worker('stockfish.wasm.js');

                // Initial UCI setup
                engineRef.current.postMessage('uci');

                engineRef.current.postMessage(`setoption name MultiPV value ${engineStore.multiPV}`);

                engineRef.current.postMessage('isready');
                engineRef.current.postMessage('ucinewgame');

                // Create a message handler that always gets the latest store reference
                const messageHandler = (e) => {
                    // Handle "readyok" message to update engine ready state
                    if (e.data === "readyok") {
                        engineStore.setIsInitialized(true);
                        console.log('readyok received, Stockfish is ready');
                    }

                    // Always use the latest message handler from the store
                    engineStore.handleEngineMessage(e.data);
                };

                engineRef.current.addEventListener('message', messageHandler);

                // Expose engine to window for direct store access
                window.stockfish = engineRef.current;

                // Mark as initialized globally
                stockfishInitialized = true;

                // Cleanup function
                return () => {
                    // Only do cleanup if this is the component that initialized the engine
                    if (engineRef.current) {
                        engineRef.current.removeEventListener('message', messageHandler);
                        engineRef.current.terminate();
                        engineRef.current = null;
                        window.stockfish = null;
                        stockfishInitialized = false;

                        // Use the current store reference
                        engineStore.setIsInitialized(false);
                    }
                };
            } catch (error) {
                console.error('Failed to initialize Stockfish engine:', error);
                engineStore.setIsInitialized(false);
                stockfishInitialized = false;
            }
        }
    }, [engineStore]); // Empty dependency array ensures this runs only once
}