import { useEffect, useRef } from "react";
import { useGameStore } from "./stores/useGameStore";
import {useEngineStore} from "./stores/useEngineStore";
import {FEN} from "cm-chess";

export function usePositionSync(options = { debounceMs: 100, currentFen: FEN.start }) {
    // Use a ref to store the timeout ID for debouncing
    const debounceTimerRef = useRef(null);

    // Subscribe to FEN changes and update engine
    useEffect(() => {
        // Clear any existing timeout
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set a debounce timer to avoid rapid-fire updates
        debounceTimerRef.current = setTimeout(() => {
            const uciMoves = useGameStore.getState().uciTillNow().join(' ');
            const turn = useGameStore.getState().getCurrentTurn();
            const currentFen = options.currentFen;

            useEngineStore.getState().setPositionAndGoIfAnalysisOn(
                FEN.start, currentFen, uciMoves, turn
            );

            debounceTimerRef.current = null;
        }, options.debounceMs);

        // Cleanup on unmount
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [options.currentFen, options.debounceMs]);
}