import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function ChesscomImportForm({
    username,
    setUsername,
    selectedDate,
    setSelectedDate,
    handleFetchGames,
    isLoading,
}) {
    return (
        <form onSubmit={handleFetchGames} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-sm lg:text-xs font-medium text-slate-300">
                    Chess.com Username
                </label>
                <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.trim())}
                    placeholder="IMRosen"
                    className="text-lg"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="month" className="text-sm lg:text-xs font-medium text-slate-300">
                    Select Month
                </label>
                <Input
                    id="month"
                    type="month"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    placeholder="YYYY-MM"
                    className="text-lg"
                />
            </div>

            <Button
                type="submit"
                variant="primary"
                disabled={!username?.trim() || !selectedDate || isLoading}
                className="text-lg tracking-tight"
            >
                {isLoading ? 'Loading...' : 'Retrieve Games'}
            </Button>
        </form>
    );
}
