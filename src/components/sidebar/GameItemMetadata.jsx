import React from 'react';
import { CalendarIcon } from '../ui/icons/CalendarIcon';
import { ClockIcon } from '../ui/icons/ClockIcon';

export function GameItemMetadata({ game }) {
    return (
        <div className="flex gap-2 items-center text-xs text-slate-400">
            <span className="flex flex-nowrap items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                {game.date.toLocaleDateString()}
            </span>
            <span className="flex flex-nowrap items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                <span className="flex flex-nowrap">{game.timeControl}</span>
            </span>
            {!game.isSupported && (
                <span className="text-yellow-500">{game.variant || 'Unsupported variant'}</span>
            )}
        </div>
    );
}
