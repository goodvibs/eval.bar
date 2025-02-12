import React from 'react';
import {useGameStore} from "../../stores/gameStore";
import {fetchChesscomGames} from "../../utils/chesscom";

export function ChesscomPanel() {
    // Get current date and format it as YYYY-MM
    const getCurrentYearMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const [username, setUsername] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(getCurrentYearMonth());
    const [games, setGames] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const { loadGame } = useGameStore();

    const handleFetchGames = async () => {
        if (!username || !selectedDate) return;

        setIsLoading(true);
        setError(null);

        try {
            const [year, month] = selectedDate.split('-');
            const fetchedGames = await fetchChesscomGames(username, year, month);
            setGames(fetchedGames);
        } catch (error) {
            setError('Failed to fetch games. Please check the username and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGameSelect = (pgn) => {
        loadGame(pgn);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">
                    Chess.com Username
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="p-2 bg-slate-700 rounded text-slate-200 border border-slate-600"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">
                    Select Month
                </label>
                <input
                    type="month"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-2 bg-slate-700 rounded text-slate-200 border border-slate-600"
                    placeholder='YYYY-MM'
                />
            </div>

            <button
                onClick={handleFetchGames}
                disabled={!username || !selectedDate || isLoading}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
            >
                {isLoading ? 'Loading...' : 'Fetch Games'}
            </button>

            {error && (
                <div className="text-red-400 text-sm">
                    {error}
                </div>
            )}

            {games.length > 0 && (
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-thin hover:scrollbar-thumb-slate-600 scrollbar-thumb-transparent scrollbar-track-transparent">
                    {games.map((game) => (
                        <button
                            key={game.id}
                            onClick={() => handleGameSelect(game.pgn)}
                            className="text-left p-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                        >
                            <div className="flex justify-between text-sm">
                                <span>{game.white} vs {game.black}</span>
                                <span className="text-slate-400">{game.result}</span>
                            </div>
                            <div className="text-xs text-slate-400">
                                {game.date.toLocaleDateString()} • {game.timeControl}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}