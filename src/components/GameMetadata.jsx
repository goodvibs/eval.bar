import React from 'react';
import { useChesscomConfigStore } from '../hooks/stores/useChesscomConfigStore';
import { useGetUsernameGameResult } from '../hooks/useGetUsernameGameResult';
import { useGameMetadata } from '../hooks/stores/useGameStore';
import { EventIcon } from './ui/icons/EventIcon';
import { CalendarIcon } from './ui/icons/CalendarIcon';
import { ClockIcon } from './ui/icons/ClockIcon';
import { BookIcon } from './ui/icons/BookIcon';

export function GameMetadata() {
    const gameMetadata = useGameMetadata();
    const { chesscomUsername } = useChesscomConfigStore();

    const usernameGameResult = useGetUsernameGameResult(gameMetadata, chesscomUsername);

    if (!gameMetadata.white || !gameMetadata.black) return null;

    return (
        <div className="flex flex-col gap-2 w-full">
            {/* Players - No wrapping, will scroll horizontally */}
            <div className="flex gap-2 text-slate-100 justify-between items-center w-full min-w-fit overflow-x-auto scrollbar-none whitespace-nowrap">
                <div className="flex flex-wrap items-center text-base xl:text-lg font-medium min-w-fit">
                    {gameMetadata.white}
                    {gameMetadata.whiteElo != null && (
                        <span className="text-xs ml-0.5">({gameMetadata.whiteElo})</span>
                    )}
                    <span className="text-slate-400 mx-1 font-normal">vs</span>
                    {gameMetadata.black}
                    {gameMetadata.blackElo != null && (
                        <span className="text-xs ml-0.5">({gameMetadata.blackElo})</span>
                    )}
                </div>
                {gameMetadata.result && (
                    <span
                        className={`
                        px-2 rounded-xl text-sm text-nowrap min-w-fit font-mono
                        ${
                            usernameGameResult === 'win'
                                ? 'bg-emerald-600'
                                : usernameGameResult === 'loss'
                                  ? 'bg-rose-600'
                                  : 'bg-slate-600'
                        }
                    `}
                    >
                        {gameMetadata.result}
                    </span>
                )}
            </div>

            {/* Game Details - Horizontal scroll instead of wrapping */}
            <div className="flex gap-4 text-xs text-slate-400 overflow-x-auto whitespace-nowrap pb-1">
                {gameMetadata.event && (
                    <span className="flex items-center gap-1 flex-shrink-0">
                        <EventIcon className="w-4 h-4" />
                        {gameMetadata.event}
                    </span>
                )}
                {gameMetadata.date && (
                    <span className="flex items-center gap-1 flex-shrink-0">
                        <CalendarIcon className="w-4 h-4" />
                        {gameMetadata.date.toLocaleDateString()}
                    </span>
                )}
                {gameMetadata.timeControl && (
                    <span className="flex items-center gap-1 flex-shrink-0">
                        <ClockIcon className="w-4 h-4" />
                        {gameMetadata.timeControl}
                    </span>
                )}
                {gameMetadata.eco && (
                    <span className="flex items-center gap-1 flex-shrink-0">
                        <BookIcon className="w-4 h-4" />
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
