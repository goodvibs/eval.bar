import React from 'react';
import {GameItem} from './GameItem';

export function GamesList({ games, username, handleGameSelect, getUsernameGameResult }) {
    return (
        <div className="relative">
            <div className="flex bg-slate-800 p-2 border rounded-lg border-slate-600 flex-1 flex-col gap-2
                scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-slate-600
                active:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                {games.map((game) => (
                    <GameItem
                        key={game.id}
                        game={game}
                        username={username}
                        getUsernameGameResult={getUsernameGameResult}
                        onSelect={() => handleGameSelect(game)}
                    />
                ))}
            </div>
        </div>
    );
}