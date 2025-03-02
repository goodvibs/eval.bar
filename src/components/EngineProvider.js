import React, { useEffect } from 'react';
import { useEngineStore } from '../hooks/stores/useEngineStore';
import { useStockfish } from '../hooks/useStockfish';

/**
 * Component that initializes and manages the engine lifecycle.
 * This component properly connects the useStockfish hook with the engine store.
 */
export function EngineProvider({ children }) {
    const setEngineInterface = useEngineStore(state => state.setEngineInterface);
    const setIsInitialized = useEngineStore(state => state.setIsInitialized);
    const handleEngineMessage = useEngineStore(state => state.handleEngineMessage);
    const sendMultiPV = useEngineStore(state => state.sendMultiPV);

    // Here's where we properly use the useStockfish hook inside a React component
    const engineInterface = useStockfish(
        // Message handler callback
        (message) => {
            handleEngineMessage(message);
        },
        // Ready handler callback
        (ready) => {
            setIsInitialized(ready);
        }
    );

    // Connect the engine interface to the store
    useEffect(() => {
        console.log('Connecting engine interface to store...');
        setEngineInterface(engineInterface);
    }, [engineInterface, setEngineInterface]);

    useEffect(() => {
        console.log('Sending MultiPV to engine...');
        sendMultiPV();
    }, [sendMultiPV]);

    // This component doesn't render anything itself, just passes through children
    return <>{children}</>;
}

export default EngineProvider;