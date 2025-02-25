import { Chessboard } from "react-chessboard";
import { ChessboardControls } from "./ChessboardControls";
import React from "react";
import { useGameStore } from "../../stores/gameStore";

export function ChessboardPanel() {
    const {
        currentPositionFen,
        makeMove,
        goToMove,
        undo,
        redo,
        gameMetadata,
        currentMoveIndex,
        gameMoveHistory,
    } = useGameStore();

    const [orientedWhite, setOrientedWhite] = React.useState(true);
    const [boardWidth, setBoardWidth] = React.useState(500);
    const containerRef = React.useRef(null);

    // Update board size based on window size
    React.useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;

            const headerHeight = 160;
            const metadataHeight = gameMetadata.white ? 60 : 0;
            const minimumHeight = 300;
            const availableHeight = Math.max(window.innerHeight - headerHeight - metadataHeight, minimumHeight);

            // Account for sidebar on larger screens
            const sidebarWidth = window.innerWidth >= 1024 ? 610 : 0;
            const availableWidth = window.innerWidth - sidebarWidth - 30;

            const newSize = Math.min(availableHeight, availableWidth);
            setBoardWidth(newSize);
        };

        // Initial calculation
        updateSize();

        // Update on window resize
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [gameMetadata.white]);

    const onPieceDrop = (sourceSquare, targetSquare) => {
        return makeMove({
            from: sourceSquare,
            to: targetSquare
        });
    };

    const firstMove = () => goToMove(-1);
    const previousMove = () => currentMoveIndex > -1 && undo();
    const nextMove = () => currentMoveIndex < gameMoveHistory.length - 1 && redo();
    const lastMove = () => goToMove(gameMoveHistory.length > 0 ? gameMoveHistory.length - 1 : 0);

    return (
        <div
            ref={containerRef}
            className="flex flex-col duration-300 transition-all w-fit max-w-full border-slate-600 border rounded-lg p-2 pb-0"
        >
            <Chessboard
                position={currentPositionFen}
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