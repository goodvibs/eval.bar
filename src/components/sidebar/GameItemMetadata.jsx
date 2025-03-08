import React from 'react';

export function GameItemMetadata({ game }) {
    return (
        <div className="flex gap-2 items-center text-xs text-slate-400">
            <span className="flex flex-nowrap items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                {game.date.toLocaleDateString()}
            </span>
            <span className="flex flex-nowrap items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span className="flex flex-nowrap">{game.timeControl}</span>
            </span>
            {!game.isSupported && (
                <span className="text-yellow-500">{game.variant || 'Unsupported variant'}</span>
            )}
        </div>
    );
}
