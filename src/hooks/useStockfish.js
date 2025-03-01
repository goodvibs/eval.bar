import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing a Stockfish chess engine instance
 *
 * @param {Function} onMessage - Callback function for engine messages
 * @param {Function} onReady - Callback function for engine ready state changes
 * @returns {Object} Engine control interface
 */
export function useStockfish(onMessage, onReady) {
    // Reference to store the worker instance
    const engineRef = useRef(null);

    /**
     * Send a command to the engine
     */
    const sendCommand = useCallback((command) => {
        if (engineRef.current) {
            console.debug('[Engine] Sending command:', command);
            engineRef.current.postMessage(command);
            return true;
        }
        console.warn('[Engine] Cannot send command, engine not initialized:', command);
        return false;
    }, []);

    /**
     * Initialize the engine
     */
    const initialize = useCallback(() => {
        if (!engineRef.current) {
            try {
                console.debug('[Engine] Initializing Stockfish engine');
                engineRef.current = new Worker('stockfish.wasm.js');

                // Set up message handler
                engineRef.current.addEventListener('message', (e) => {
                    // Handle "readyok" message to update engine ready state
                    if (e.data === "readyok" && onReady) {
                        console.debug('[Engine] Engine is ready');
                        onReady(true);
                    }

                    // Pass all messages to the caller
                    if (onMessage) {
                        onMessage(e.data);
                    }
                });

                // Initial setup
                sendCommand('uci');
                sendCommand('isready');
                sendCommand('ucinewgame');

                return true;
            } catch (error) {
                console.error('[Engine] Failed to initialize Stockfish engine:', error);
                if (onReady) onReady(false);
                return false;
            }
        }
        return true;
    }, [onMessage, onReady, sendCommand]);

    /**
     * Configure the engine
     */
    const configure = useCallback((options = {}) => {
        if (!engineRef.current) {
            console.warn('[Engine] Cannot configure engine, not initialized');
            return false;
        }

        // Set engine options
        Object.entries(options).forEach(([name, value]) => {
            sendCommand(`setoption name ${name} value ${value}`);
        });

        return true;
    }, [sendCommand]);

    /**
     * Terminate the engine
     */
    const terminate = useCallback(() => {
        if (engineRef.current) {
            console.debug('[Engine] Terminating engine');
            engineRef.current.terminate();
            engineRef.current = null;
            if (onReady) onReady(false);
            return true;
        }
        return false;
    }, [onReady]);

    // Initialize engine on component mount and clean up on unmount
    useEffect(() => {
        initialize();

        return () => {
            terminate();
        };
    }, [initialize, terminate]);

    // Return the engine interface
    return {
        sendCommand,
        configure,
        terminate,
        isInitialized: !!engineRef.current
    };
}