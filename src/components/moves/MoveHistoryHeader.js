import React from 'react';
import {useGameStore} from "../../hooks/stores/useGameStore";
import {analyzeOnLichess} from "../../utils/lichess";

export function MoveHistoryHeader() {
    const { renderPgn, getCurrentFullmove, getPgnFullmoveCount, getCurrentTurn } = useGameStore();

    const totalFullmoveCount = getPgnFullmoveCount();
    const currentFullmove = getCurrentFullmove();
    const turn = getCurrentTurn();

    const handleCopyPgn = async () => {
        try {
            await navigator.clipboard.writeText(renderPgn());
        } catch (err) {
            console.error('Failed to copy PGN:', err);
        }
    };

    const handleDownloadPgn = () => {
        const blob = new Blob([renderPgn()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'game.pgn';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleLichessAnalysis = () => {
        analyzeOnLichess(renderPgn(), false);
    };

    return (
        <div className="px-3 py-2 border-b border-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Move count */}
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-300">Move</span>
                    <span className="text-xs font-mono text-center text-slate-400">
                        {`${currentFullmove}/${totalFullmoveCount}`}
                    </span>
                </div>
                {/* Side to move */}
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-300">To Move</span>
                    <span className="text-xs font-mono text-center text-slate-400">
                        {turn === 'w' ? 'White' : turn ==='b' ? 'Black' : null}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                {/* Lichess Analysis Button */}
                <button
                    onClick={handleLichessAnalysis}
                    className="text-xs bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-200 bg-0 hover:bg-100 ease-in-out text-slate-100 transition-all px-1 py-0.5 rounded-3xl flex items-center gap-1 tracking-widest font-black uppercase"
                >
                    <svg className="w-6 h-6 fill-slate-100" viewBox="-12 -12 74 74" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinejoin="round"
                              d="M38.956.5c-3.53.418-6.452.902-9.286 2.984C5.534 1.786-.692 18.533.68 29.364 3.493 50.214 31.918 55.785 41.329 41.7c-7.444 7.696-19.276 8.752-28.323 3.084C3.959 39.116-.506 27.392 4.683 17.567 9.873 7.742 18.996 4.535 29.03 6.405c2.43-1.418 5.225-3.22 7.655-3.187l-1.694 4.86 12.752 21.37c-.439 5.654-5.459 6.112-5.459 6.112-.574-1.47-1.634-2.942-4.842-6.036-3.207-3.094-17.465-10.177-15.788-16.207-2.001 6.967 10.311 14.152 14.04 17.663 3.73 3.51 5.426 6.04 5.795 6.756 0 0 9.392-2.504 7.838-8.927L37.4 7.171z"/>
                    </svg>
                    Lichess
                </button>

                {/* Copy PGN Button */}
                <button
                    onClick={handleCopyPgn}
                    className="text-sm text-slate-300 hover:text-slate-100 transition-colors p-1 rounded hover:bg-slate-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                </button>

                {/* Download PGN Button */}
                <button
                    onClick={handleDownloadPgn}
                    className="text-sm text-slate-300 hover:text-slate-100 transition-colors p-1 rounded hover:bg-slate-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>
            </div>
        </div>
    );
}