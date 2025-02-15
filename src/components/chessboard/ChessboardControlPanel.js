import { Chessboard } from "react-chessboard";
import { ChessboardControls } from "./ChessboardControls";
import React from "react";
import { useGameStore } from "../../stores/gameStore";

export function ChessboardControlPanel() {
    const {
        currentFen,
        makeMove,
        goToMove,
        currentMoveIndex,
        moveHistory,
    } = useGameStore();

    const [orientedWhite, setOrientedWhite] = React.useState(true);
    const [boardWidth, setBoardWidth] = React.useState(500);
    const containerRef = React.useRef(null);

    // Update board size based on window size
    React.useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;

            // Calculate available height (viewport height minus header space)
            const availableHeight = Math.max(window.innerHeight - 200, 300);
            const availableWidth = window.innerWidth - 30;
            const newSize = Math.min(availableHeight, availableWidth);

            setBoardWidth(newSize);
        };

        // Initial calculation
        updateSize();

        // Update on window resize
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const onPieceDrop = (sourceSquare, targetSquare) => {
        return makeMove({
            from: sourceSquare,
            to: targetSquare
        });
    };

    const firstMove = () => goToMove(-1);
    const previousMove = () => currentMoveIndex > -1 && goToMove(currentMoveIndex - 1);
    const nextMove = () => currentMoveIndex < moveHistory.length - 1 && goToMove(currentMoveIndex + 1);
    const lastMove = () => goToMove(moveHistory.length > 0 ? moveHistory.length - 1 : 0);

    return (
        <div
            ref={containerRef}
            className="flex flex-col duration-300 transition-all max-w-full border-slate-500 border rounded-lg p-2 pb-0"
        >
            <Chessboard
                position={currentFen}
                boardWidth={boardWidth}
                customLightSquareStyle={{ backgroundColor: "#cbd5e1" }}
                customDarkSquareStyle={{ backgroundColor: "#64748b" }}
                boardOrientation={orientedWhite ? "white" : "black"}
                onPieceDrop={onPieceDrop}
            />

            <ChessboardControls
                firstMove={firstMove}
                previousMove={previousMove}
                nextMove={nextMove}
                lastMove={lastMove}
                orientedWhite={orientedWhite}
                setOrientedWhite={setOrientedWhite}
            />
        </div>
    );
}