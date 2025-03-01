import React, { useEffect } from 'react';
import { useEngineStore } from '../hooks/stores/useEngineStore';
import { useStockfish } from '../hooks/useStockfish';

/**
 * Component that initializes and manages the engine lifecycle.
 * This component properly connects the useStockfish hook with the engine store.
 */
export function EngineProvider({ children }) {
    const setEngineInterface = useEngineStore(state => state.setEngineInterface);
    const setEngineReady = useEngineStore(state => state.setEngineReady);
    const handleEngineMessage = useEngineStore(state => state.handleEngineMessage);

    // Here's where we properly use the useStockfish hook inside a React component
    const engineInterface = useStockfish(
        // Message handler callback
        (message) => {
            handleEngineMessage(message);
        },
        // Ready handler callback
        (ready) => {
            setEngineReady(ready);
        }
    );

    // Connect the engine interface to the store
    useEffect(() => {
        console.log('Connecting engine interface to store...');
        setEngineInterface(engineInterface);

        return () => {
            // Clean up
            if (engineInterface) {
                engineInterface.terminate();
            }
            // Clear the engine interface from the store
            setEngineInterface(null);
            setEngineReady(false);
        };
    }, [engineInterface, setEngineInterface, setEngineReady]);

    // This component doesn't render anything itself, just passes through children
    return <>{children}</>;
}

export default EngineProvider;