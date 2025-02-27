import React from "react";
import {useGameStore} from "../hooks/stores/useGameStore";

export function GameMetadata() {
    const { gameMetadata, usernameGameResult } = useGameStore();

    if (!gameMetadata.white || !gameMetadata.black) return null;

    return (
        <div className="flex flex-col gap-2 px-4">
            {/* Players */}
            <div className="flex gap-2 text-slate-100 justify-between items-center">
                <div className="flex flex-wrap items-center text-sm font-medium">
                    {gameMetadata.white}
                    <span className="text-xs ml-0.5">({gameMetadata.whiteElo})</span>
                    <span className="text-slate-400 mx-1 font-normal">vs</span>
                    {gameMetadata.black}
                    <span className="text-xs ml-0.5">({gameMetadata.blackElo})</span>
                </div>
                {gameMetadata.result && (
                    <span className={`
                        px-2 py-1 rounded text-xs text-nowrap min-w-fit font-mono
                        ${usernameGameResult === 'win' ? 'bg-emerald-600' : 
                        usernameGameResult === 'loss' ? 'bg-rose-600' :
                            'bg-slate-600'}
                    `}>
                        {gameMetadata.result}
                    </span>
                )}
            </div>

            {/* Game Details */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                {gameMetadata.event && (
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        {gameMetadata.event}
                    </span>
                )}
                {gameMetadata.date && (
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {gameMetadata.date.toLocaleDateString()}
                    </span>
                )}
                {gameMetadata.timeControl && (
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {gameMetadata.timeControl}
                    </span>
                )}
                {gameMetadata.eco && (
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                        {gameMetadata.eco}
                        {gameMetadata.opening && (
                            <span className="ml-1">: {gameMetadata.opening}</span>
                        )}
                    </span>
                )}
            </div>
        </div>
    );
}