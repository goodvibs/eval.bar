import {useEngineStore} from "../stores/useEngineStore";
import {useGameStore} from "../stores/gameStore";
import React from "react";

export function usePositionSync() {
    const updatePosition = useEngineStore(state => state.updatePosition);
    const currentFen = useGameStore(state => state.currentPositionFen);

    // Subscribe to FEN changes and update engine
    React.useEffect(() => {
        updatePosition(currentFen);
    }, [currentFen, updatePosition]);
}