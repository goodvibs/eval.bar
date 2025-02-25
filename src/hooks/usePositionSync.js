import { useEffect, useRef } from "react";
import { engineStore } from "../stores/engineStore";
import { useGameStore } from "../stores/gameStore";

export function usePositionSync(options = { debounceMs: 100 }) {
    const updatePosition = engineStore(state => state.updatePosition);
    const isAnalyzing = engineStore(state => state.isAnalyzing);
    const currentFen = useGameStore(state => state.currentPositionFen);

    // Use a ref to store the timeout ID for debouncing
    const debounceTimerRef = useRef(null);

    // Keep track of the last processed FEN to avoid redundant updates
    const lastFenRef = useRef(currentFen);

    // Subscribe to FEN changes and update engine
    useEffect(() => {
        // Skip if the FEN hasn't actually changed (prevents needless work)
        if (currentFen === lastFenRef.current) return;

        // Update the last FEN reference
        lastFenRef.current = currentFen;

        // Clear any existing timeout
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set a debounce timer to avoid rapid-fire updates
        debounceTimerRef.current = setTimeout(() => {
            updatePosition(currentFen);
            debounceTimerRef.current = null;
        }, options.debounceMs);

        // Cleanup on unmount
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [currentFen, updatePosition, options.debounceMs]);

    // Return whether the position is currently synced
    return {
        isSynced: lastFenRef.current === currentFen && !debounceTimerRef.current,
        isAnalyzing
    };
}