import React, { useState, useRef, useEffect } from 'react';
import { useGameDerivedState, usePgnDerivedState } from '../../hooks/stores/useGameStore';
import { analyzeOnLichess } from '../../utils/lichess';
import { IconButton } from '../ui/IconButton';
import { CopyIcon } from '../ui/icons/CopyIcon';
import { DownloadIcon } from '../ui/icons/DownloadIcon';

export function MoveHistoryHeader() {
    const { fullmoveCount: currentFullmove, turn } = useGameDerivedState();
    const { fullmoveCount: totalFullmoveCount, pgnText } = usePgnDerivedState();
    const [copied, setCopied] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const lichessContainerRef = useRef(null);

    const hasExportableContent = pgnText?.trim() && pgnText.includes('1.');

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                lichessContainerRef.current &&
                !lichessContainerRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpenInLichess = () => {
        analyzeOnLichess(pgnText, false);
        setDropdownOpen(false);
    };

    const handleImportToLichess = () => {
        analyzeOnLichess(pgnText, true);
        setDropdownOpen(false);
    };

    const handleCopyPgn = async () => {
        try {
            await navigator.clipboard.writeText(pgnText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy PGN:', err);
        }
    };

    const handleDownloadPgn = () => {
        const blob = new Blob([pgnText], { type: 'text/plain' });
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
        <div className="px-3 py-2 border-b border-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Move count */}
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-300">Move</span>
                    <span className="text-xs font-mono text-center text-slate-400">
                        {totalFullmoveCount === 0 ? '—/—' : `${currentFullmove}/${totalFullmoveCount}`}
                    </span>
                </div>
                {/* Side to move */}
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-300">To Move</span>
                    <span className="text-xs font-mono text-center text-slate-400">
                        {turn === 'w' ? 'White' : turn === 'b' ? 'Black' : '—'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                {/* Lichess split button with dropdown */}
                <div ref={lichessContainerRef} className="relative flex">
                    <button
                        onClick={handleOpenInLichess}
                        disabled={!hasExportableContent}
                        className="text-xs bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-200 bg-0 hover:bg-100 ease-in-out text-slate-100 transition-all px-1 py-0.5 rounded-l-3xl flex items-center gap-1 tracking-widest font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Open in Lichess (quick, no save)"
                        aria-label="Open game in Lichess for analysis"
                    >
                        <svg
                            className="w-6 h-6 fill-slate-100"
                            viewBox="-12 -12 74 74"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinejoin="round"
                                d="M38.956.5c-3.53.418-6.452.902-9.286 2.984C5.534 1.786-.692 18.533.68 29.364 3.493 50.214 31.918 55.785 41.329 41.7c-7.444 7.696-19.276 8.752-28.323 3.084C3.959 39.116-.506 27.392 4.683 17.567 9.873 7.742 18.996 4.535 29.03 6.405c2.43-1.418 5.225-3.22 7.655-3.187l-1.694 4.86 12.752 21.37c-.439 5.654-5.459 6.112-5.459 6.112-.574-1.47-1.634-2.942-4.842-6.036-3.207-3.094-17.465-10.177-15.788-16.207-2.001 6.967 10.311 14.152 14.04 17.663 3.73 3.51 5.426 6.04 5.795 6.756 0 0 9.392-2.504 7.838-8.927L37.4 7.171z"
                            />
                        </svg>
                        Lichess
                    </button>
                    <button
                        onClick={() => setDropdownOpen(o => !o)}
                        disabled={!hasExportableContent}
                        className="text-xs bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-200 bg-0 hover:bg-100 ease-in-out text-slate-100 transition-all px-0.5 py-0.5 rounded-r-3xl border-l border-slate-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Lichess options"
                        aria-label="Lichess export options"
                        aria-expanded={dropdownOpen}
                    >
                        <svg
                            className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    <div
                        className={`absolute right-0 top-full mt-1 transform origin-top-right transition-all duration-200 ease-out z-10 ${
                            dropdownOpen
                                ? 'opacity-100 scale-100 translate-y-0 visible'
                                : 'opacity-0 scale-95 -translate-y-2 invisible'
                        }`}
                    >
                        <div className="bg-slate-800 rounded-lg border border-slate-600 shadow-lg py-1 min-w-48">
                            <button
                                onClick={handleOpenInLichess}
                                className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors flex flex-col"
                            >
                                <span className="font-medium">Open in Lichess</span>
                                <span className="text-xs text-slate-400">Quick, no save</span>
                            </button>
                            <button
                                onClick={handleImportToLichess}
                                className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors flex flex-col"
                            >
                                <span className="font-medium">Import to Lichess</span>
                                <span className="text-xs text-slate-400">Saves to your Lichess</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copy PGN Button */}
                <button
                    onClick={handleCopyPgn}
                    disabled={!hasExportableContent}
                    className="text-sm text-slate-300 hover:text-slate-100 transition-colors p-1 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={copied ? 'Copied!' : 'Copy PGN'}
                    aria-label={copied ? 'Copied to clipboard' : 'Copy PGN to clipboard'}
                >
                    {copied ? (
                        <span className="text-xs text-emerald-400 font-medium">Copied!</span>
                    ) : (
                        <CopyIcon className="h-4 w-4" />
                    )}
                </button>

                {/* Download PGN Button */}
                <IconButton
                    icon={<DownloadIcon className="h-4 w-4" />}
                    label="Download PGN file"
                    title="Download PGN"
                    onClick={handleDownloadPgn}
                    disabled={!hasExportableContent}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        </div>
    );
}
