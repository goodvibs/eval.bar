import { Chessboard } from "react-chessboard";
import { ChessboardControls } from "./ChessboardControls";
import React from "react";
import { useGameStore } from "../../hooks/stores/useGameStore";
import { useEngineStore } from "../../hooks/stores/useEngineStore";
import { Chess } from "cm-chess";

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

    const { isAnalyzing, currentLines } = useEngineStore();

    const [orientedWhite, setOrientedWhite] = React.useState(true);
    const [boardWidth, setBoardWidth] = React.useState(500);
    const [selectedPiece, setSelectedPiece] = React.useState(null);
    const [possibleMoves, setPossibleMoves] = React.useState([]);
    const [customArrows, setCustomArrows] = React.useState([]);
    const [kingInCheck, setKingInCheck] = React.useState(null);

    const containerRef = React.useRef(null);
    const chessRef = React.useRef(new Chess());

    React.useEffect(() => {
        try {
            chessRef.current.load(currentPositionFen);

            // Check if king is in check and find its position
            if (chessRef.current.inCheck()) {
                const turn = chessRef.current.turn();

                // Find the king's position
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        const square = String.fromCharCode(97 + col) + (8 - row);
                        const piece = chessRef.current.piece(square);
                        if (piece && piece.type === 'k' && piece.color === turn) {
                            setKingInCheck(square);
                            return;
                        }
                    }
                }
            } else {
                setKingInCheck(null);
            }
        } catch (e) {
            console.error("Failed to load position:", e);
            setKingInCheck(null);
        }
    }, [currentPositionFen]);

    // Update best move arrows when analysis changes
    React.useEffect(() => {
        if (!isAnalyzing || !currentLines || currentLines.length === 0) {
            setCustomArrows([]);
            return;
        }

        // Get the best line (first line)
        const bestLine = currentLines[0];
        if (!bestLine || !bestLine.moves || bestLine.moves.length === 0) {
            setCustomArrows([]);
            return;
        }

        // We want to show only the next move as an arrow
        try {
            const tempChess = new Chess(currentPositionFen);

            // Get the first move in the best line
            const sanMove = bestLine.moves[0];

            // Convert SAN to move object with from/to
            const moveObj = tempChess.move(sanMove);
            if (!moveObj) {
                setCustomArrows([]);
                return;
            }

            // Create arrow from best move
            // Use blue for best move arrow
            setCustomArrows([[moveObj.from, moveObj.to, "#285b8d"]]);
        } catch (e) {
            console.error("Error setting best move arrow:", e);
            setCustomArrows([]);
        }
    }, [isAnalyzing, currentLines, currentPositionFen]);

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

    // Common function to find legal moves and highlight them
    const findLegalMoves = (piece, square) => {
        // Only allow piece selection if it's the current player's turn
        const isWhitePiece = piece[0] === 'w';
        const isWhiteTurn = chessRef.current.turn() === 'w';
        if (isWhitePiece !== isWhiteTurn) {
            setSelectedPiece(null);
            setPossibleMoves([]);
            return;
        }

        // Select the piece
        setSelectedPiece(square);

        // Get all legal moves for this piece
        const moves = chessRef.current.moves({ square, verbose: true });
        setPossibleMoves(moves.map(move => move.to));
    };

    // Handle piece click to show possible moves
    const handlePieceClick = (piece, square) => {
        // If the same piece is clicked again, deselect it
        if (selectedPiece === square) {
            setSelectedPiece(null);
            setPossibleMoves([]);
            return;
        }

        findLegalMoves(piece, square);
    };

    // Handle piece drag start to show possible moves
    const handlePieceDragBegin = (piece, square) => {
        findLegalMoves(piece, square);
    };

    // Handle piece drop to make a move
    const onPieceDrop = (sourceSquare, targetSquare, promotion) => {
        // Clear selection and dots when a move is made
        setSelectedPiece(null);
        setPossibleMoves([]);

        // Check if we need promotion
        return makeMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: promotion[1].toLowerCase(),
        });
    };

    // Navigation functions
    const firstMove = () => goToMove(-1);
    const previousMove = () => currentMoveIndex > -1 && undo();
    const nextMove = () => currentMoveIndex < gameMoveHistory.length - 1 && redo();
    const lastMove = () => goToMove(gameMoveHistory.length > 0 ? gameMoveHistory.length - 1 : 0);

    return (
        <div
            ref={containerRef}
            className="flex z-0 flex-col duration-300 transition-all w-fit max-w-full border-slate-500 border rounded-lg p-2 pb-0"
        >
            <Chessboard
                position={currentPositionFen}
                boardWidth={boardWidth}
                customLightSquareStyle={{ backgroundColor: "#e1dfcb" }}
                customDarkSquareStyle={{ backgroundColor: "#648b67" }}
                boardOrientation={orientedWhite ? "white" : "black"}
                onPieceDrop={onPieceDrop}
                onPieceClick={handlePieceClick}
                onPieceDragBegin={handlePieceDragBegin}
                customArrows={customArrows}
                customSquareStyles={{
                    // Highlight selected piece with a consistent color
                    ...(selectedPiece && {
                        [selectedPiece]: {
                            backgroundColor: "rgb(255, 217, 102, 0.1)"
                        }
                    }),
                    // Highlight king in check with a red background
                    ...(kingInCheck && {
                        [kingInCheck]: {
                            backgroundColor: "rgba(255, 0, 0, 0.3)",
                            boxShadow: "0 0 10px 0 rgba(255, 0, 0, 0.6)",
                            borderRadius: "20%",
                        }
                    }),
                    // Highlight possible moves with consistent dots
                    ...Object.fromEntries(
                        possibleMoves.map(square => [
                            square,
                            {
                                // Use the same background color for all move indicators
                                backgroundImage: "radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)",
                                backgroundPosition: "center",
                                backgroundSize: "50%",
                                backgroundRepeat: "no-repeat",
                            }
                        ])
                    )
                }}
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