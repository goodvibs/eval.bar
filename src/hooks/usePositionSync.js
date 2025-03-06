import { useEffect, useRef } from "react";
import {useEngineActions} from "./stores/useEngineStore";
import {FEN} from "cm-chess";
import {useGameDerivedState} from "./stores/useGameStore";

export function usePositionSync() {
    console.log('usePositionSync');
    // Use a ref to store the timeout ID for debouncing
    const debounceTimerRef = useRef(null);

    const { fen } = useGameDerivedState();

    const { turn, moves } = useGameDerivedState();
    const uciMoves = moves.map(move => move.uci).join(' ');

    const { setPositionAndGoIfAnalysisOn } = useEngineActions();

    // Subscribe to FEN changes and update engine
    useEffect(() => {
        // Clear any existing timeout
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set a debounce timer to avoid rapid-fire updates
        debounceTimerRef.current = setTimeout(() => {

            setPositionAndGoIfAnalysisOn(
                FEN.start, fen, uciMoves, turn
            );

            debounceTimerRef.current = null;
        }, 100);

        // Cleanup on unmount
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [fen, setPositionAndGoIfAnalysisOn, turn, uciMoves]);
}