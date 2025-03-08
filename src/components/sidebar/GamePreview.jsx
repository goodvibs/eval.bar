import React from 'react';
import { Chessboard } from 'react-chessboard';

export function GamePreview({ game }) {
    return (
        <div className="absolute pointer-events-none z-50 w-fit bg-slate-800 rounded-lg shadow-lg p-2 border border-slate-600 bottom-full left-1/2 transform -translate-x-1/2 mb-1">
            <Chessboard
                position={game.finalPosition}
                boardWidth={100}
                isDraggable={false}
                customLightSquareStyle={{ backgroundColor: '#cbd5e1' }}
                customDarkSquareStyle={{ backgroundColor: '#64748b' }}
            />
        </div>
    );
}
