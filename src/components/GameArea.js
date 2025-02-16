import React from "react";
import {AnalysisPanel} from "./analysis/AnalysisPanel";
import {MoveHistory} from "./moves/MoveHistory";
import {useGameStore} from "../stores/gameStore";
import {ChessboardControlPanel} from "./chessboard/ChessboardControlPanel";

export function GameArea() {
    const { metadata } = useGameStore();
    const [firstContainerHeight, setFirstContainerHeight] = React.useState(0);
    const firstContainerRef = React.useRef(null);

    // Update height when first container changes
    React.useEffect(() => {
        // Use ResizeObserver to detect actual content size changes
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                setFirstContainerHeight(entries[0].target.offsetHeight);
            }
        });

        if (firstContainerRef.current) {
            resizeObserver.observe(firstContainerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [metadata]); // Re-run when metadata changes as it affects container height

    return (
        <main className="flex flex-1 justify-center flex-wrap gap-4 p-4 overflow-hidden">
            <div ref={firstContainerRef} className="flex h-fit flex-col gap-4">
                {metadata.white && metadata.black && (
                    <div className="flex justify-between items-center text-slate-300">
                        <div className="text-lg">
                            {metadata.white} vs {metadata.black}
                        </div>
                        <div className="text-sm text-slate-400">
                            {metadata.date} • {metadata.event}
                        </div>
                    </div>
                )}

                <ChessboardControlPanel />
            </div>

            <div
                className="flex flex-col flex-1 min-w-72 gap-4"
                style={{ height: firstContainerHeight || 'auto' }}
            >
                <AnalysisPanel />
                <MoveHistory />
            </div>
        </main>
    );
}