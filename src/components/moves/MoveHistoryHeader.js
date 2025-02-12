import React from 'react';
import {useGameStore} from "../../stores/gameStore";

export function MoveHistoryHeader() {
    const { currentMoveIndex, moveHistory, currentFen, currentPgn } = useGameStore();
    const [showCopyTooltip, setShowCopyTooltip] = React.useState(false);

    const totalMoves = Math.ceil(moveHistory.length / 2);
    const currentMove = Math.floor(currentMoveIndex / 2) + 1;

    const handleCopyPgn = async () => {
        try {
            await navigator.clipboard.writeText(currentPgn);
            setShowCopyTooltip(true);
            setTimeout(() => setShowCopyTooltip(false), 2000);
        } catch (err) {
            console.error('Failed to copy PGN:', err);
        }
    };

    const handleDownloadPgn = () => {
        const blob = new Blob([currentPgn], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'game.pgn';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="px-3 py-2 bg-slate-700 border-b border-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Move count */}
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-300">Move</span>
                    <span className="text-xs text-slate-400">
            {currentMoveIndex >= 0 ? `${currentMove}/${totalMoves}` : '-'}
          </span>
                </div>

                {/* Side to move */}
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-300">To Move</span>
                    <span className="text-xs text-slate-400">
            {currentMoveIndex === -1 ? 'White' :
                currentMoveIndex % 2 === 0 ? 'Black' : 'White'}
          </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                {/* Copy PGN Button */}
                <div className="relative">
                    <button
                        onClick={handleCopyPgn}
                        className="text-sm text-slate-300 hover:text-white transition-colors p-1 rounded hover:bg-slate-600"
                        title="Copy PGN"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    </button>
                    {showCopyTooltip && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-slate-900 rounded">
                            Copied!
                        </div>
                    )}
                </div>

                {/* Download PGN Button */}
                <button
                    onClick={handleDownloadPgn}
                    className="text-sm text-slate-300 hover:text-white transition-colors p-1 rounded hover:bg-slate-600"
                    title="Download PGN"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>

                {/* Share Button - Could add in future */}
                <button
                    className="text-sm text-slate-300 hover:text-white transition-colors p-1 rounded hover:bg-slate-600"
                    title="Share Position"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}