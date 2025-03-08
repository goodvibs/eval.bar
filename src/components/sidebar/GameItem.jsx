import React from 'react';
import { GameItemMetadata } from './GameItemMetadata';
import { GamePreview } from './GamePreview';
import { useGetUsernameGameResult } from '../../hooks/useGetUsernameGameResult';

export function GameItem({ game, username, onSelect }) {
    const [isHovered, setIsHovered] = React.useState(false);
    const gameResult = useGetUsernameGameResult(game, username);

    const resultBackgroundColor =
        gameResult === 'win'
            ? 'bg-emerald-600'
            : gameResult === 'loss'
              ? 'bg-rose-600'
              : 'bg-slate-600';

    return (
        <div className="relative">
            <button
                onClick={onSelect}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={!game.isSupported}
                className={`
                    text-left p-3 rounded bg-slate-800 w-full
                    ${game.isSupported ? 'hover:bg-slate-600' : ''}
                    relative
                `}
            >
                <div className="flex flex-col gap-y-2">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-wrap items-center text-sm font-medium gap-x-1">
                            {game.white}
                            <span className="text-xs">({game.whiteElo})</span>
                            <span className="text-slate-400 font-normal">vs</span>
                            {game.black}
                            <span className="text-xs">({game.blackElo})</span>
                        </div>
                        <span
                            className={`
                            px-2 rounded-xl text-xs text-nowrap min-w-fit font-mono
                            ${resultBackgroundColor}
                        `}
                        >
                            {game.result}
                        </span>
                    </div>
                    <GameItemMetadata game={game} />
                </div>
            </button>

            {isHovered && <GamePreview game={game} />}
        </div>
    );
}
