import React from 'react';

export function ChesscomImportForm({
                        username,
                        setUsername,
                        selectedDate,
                        setSelectedDate,
                        handleFetchGames,
                        isLoading
                    }) {
    return (
        <form onSubmit={handleFetchGames} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-sm lg:text-xs font-medium text-slate-300">
                    Chess.com Username
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                    placeholder="IMRosen"
                    className="p-2 bg-slate-800 outline-none rounded text-slate-200 border border-slate-600"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="month" className="text-sm lg:text-xs font-medium text-slate-300">
                    Select Month
                </label>
                <input
                    id="month"
                    type="month"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-2 bg-slate-800 rounded outline-none text-slate-200 border border-slate-600"
                    placeholder='YYYY-MM'
                />
            </div>

            <button
                type="submit"
                disabled={!selectedDate || isLoading}
                className="bg-emerald-600 transition-all text-slate-100 p-2 rounded hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600"
            >
                {isLoading ? 'Loading...' : 'Get Games'}
            </button>
        </form>
    );
}