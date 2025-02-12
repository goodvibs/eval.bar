// ChessboardContainer.jsx
import React, { useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { useGameStore } from './gameState';
import { StockfishManager } from './stockfishManager';

export function ChessboardContainer() {
    const {
        currentFen,
        makeMove,
        updateAnalysis,
        analysis
    } = useGameStore();

    const stockfishRef = React.useRef(null);

    useEffect(() => {
        stockfishRef.current = new StockfishManager(updateAnalysis);
        stockfishRef.current.init();

        return () => stockfishRef.current?.stop();
    }, []);

    useEffect(() => {
        if (stockfishRef.current) {
            stockfishRef.current.analyzeFen(currentFen);
        }
    }, [currentFen]);

    function onPieceDrop(source, target) {
        return makeMove({
            from: source,
            to: target
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <Chessboard
                position={currentFen}
                onPieceDrop={onPieceDrop}
                boardWidth={500}
                customLightSquareStyle={{backgroundColor: "#cbd5e1"}}
                customDarkSquareStyle={{backgroundColor: "#64748b"}}
            />
            <div className="flex gap-2 bg-slate-600 rounded p-2">
        <span className="font-bold text-slate-50">
          {analysis.evaluation.toFixed(2)}
        </span>
                <span className="text-slate-300">
          Depth: {analysis.depth}
        </span>
            </div>
        </div>
    );
}