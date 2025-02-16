import React from 'react';
import {useGameStore} from "../../stores/gameStore";
import {analyzeOnLichess} from "../../utils/lichess";

function Tooltip({ children, className = "" }) {
    return (
        <div className={`fixed -translate-y-full -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-900 rounded whitespace-nowrap pointer-events-none ${className}`}
             style={{ left: '50%', top: 'var(--tooltip-top, 0px)' }}>
            {children}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-4 border-transparent border-t-slate-900"/>
            </div>
        </div>
    );
}

function TooltipContainer({ children, tooltip }) {
    const [tooltipPosition, setTooltipPosition] = React.useState(0);
    const buttonRef = React.useRef(null);

    React.useEffect(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setTooltipPosition(rect.top);
        }
    }, []);

    return (
        <div className="relative group" ref={buttonRef} style={{ '--tooltip-top': `${tooltipPosition}px` }}>
            {children}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>{tooltip}</Tooltip>
            </div>
        </div>
    );
}

export function MoveHistoryHeader() {
    const { currentMoveIndex, moveHistory, currentPgn } = useGameStore();
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

    const handleLichessAnalysis = () => {
        analyzeOnLichess(currentPgn, false);
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
                        {currentMoveIndex === -1 ? 'White' : currentMoveIndex % 2 === 0 ? 'Black' : 'White'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                {/* Lichess Analysis Button */}
                <TooltipContainer tooltip="Analyze on Lichess.org">
                    <button
                        onClick={handleLichessAnalysis}
                        className="text-xs bg-blue-500 hover:bg-blue-400 text-white transition-colors px-1 rounded-md flex items-center gap-1 tracking-wider font-semibold"
                    >
                        <svg className="w-6 h-6 fill-slate-50" viewBox="-12 -12 74 74" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinejoin="round"
                                  d="M38.956.5c-3.53.418-6.452.902-9.286 2.984C5.534 1.786-.692 18.533.68 29.364 3.493 50.214 31.918 55.785 41.329 41.7c-7.444 7.696-19.276 8.752-28.323 3.084C3.959 39.116-.506 27.392 4.683 17.567 9.873 7.742 18.996 4.535 29.03 6.405c2.43-1.418 5.225-3.22 7.655-3.187l-1.694 4.86 12.752 21.37c-.439 5.654-5.459 6.112-5.459 6.112-.574-1.47-1.634-2.942-4.842-6.036-3.207-3.094-17.465-10.177-15.788-16.207-2.001 6.967 10.311 14.152 14.04 17.663 3.73 3.51 5.426 6.04 5.795 6.756 0 0 9.392-2.504 7.838-8.927L37.4 7.171z"/>
                        </svg>
                        Lichess
                    </button>
                </TooltipContainer>

                {/* Copy PGN Button */}
                <TooltipContainer tooltip={showCopyTooltip ? "Copied!" : "Copy PGN"}>
                    <button
                        onClick={handleCopyPgn}
                        className="text-sm text-slate-300 hover:text-white transition-colors p-1 rounded hover:bg-slate-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    </button>
                </TooltipContainer>

                {/* Download PGN Button */}
                <TooltipContainer tooltip="Download PGN">
                    <button
                        onClick={handleDownloadPgn}
                        className="text-sm text-slate-300 hover:text-white transition-colors p-1 rounded hover:bg-slate-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                </TooltipContainer>
            </div>
        </div>
    );
}