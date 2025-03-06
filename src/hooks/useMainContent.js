import { useRef, useMemo } from 'react';
import { useBoardResize } from "./useBoardResize";
import { usePositionSync } from "./usePositionSync";
import { useGameDerivedState } from "./stores/useGameStore";

/**
 * Custom hook that contains all the logic for the MainContent component
 *
 * @returns {Object} State and refs for the MainContent component
 */
export function useMainContent() {
    // Create a ref for the main container
    const mainRef = useRef(null);

    // Sync the position with the engine
    usePositionSync();

    // Get board and panel dimensions
    const { boardWidth, rightPanelWidth } = useBoardResize();

    // Create memoized style object for the right panel to prevent unnecessary renders
    const rightPanelStyle = useMemo(() => ({
        width: rightPanelWidth
    }), [rightPanelWidth]);

    // Return all values needed by the component
    return {
        mainRef,
        boardWidth,
        rightPanelStyle
    };
}