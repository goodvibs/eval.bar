import React from 'react';
import {useGameStore} from "../../hooks/stores/useGameStore";
import {fetchChesscomGames} from "../../utils/chesscom";
import {ChesscomImportForm} from "./ChesscomImportForm";
import {GamesList} from "./GamesList";

function getUsernameGameResult(game, username) {
    if (game.white.toLowerCase() === username.toLowerCase()) {
        return game.result === '1-0' ? 'win' : game.result === '0-1' ? 'loss' : 'draw';
    } else if (game.black.toLowerCase() === username.toLowerCase()) {
        return game.result === '0-1' ? 'win' : game.result === '1-0' ? 'loss' : 'draw';
    }
    return null;
}

export function ChesscomImportPanel({ closeSidebar }) {
    const { username, setUsername, setUsernameGameResult, loadChesscomGame } = useGameStore();

    const [games, setGames] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    // Get current date and format it as YYYY-MM
    const getCurrentYearMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const [selectedDate, setSelectedDate] = React.useState(getCurrentYearMonth());

    const handleFetchGames = async (e) => {
        // If called from a form submission, prevent default behavior
        if (e) e.preventDefault();

        if (!username || !selectedDate) return;

        setIsLoading(true);
        setError(null);

        try {
            const [year, month] = selectedDate.split('-');
            const fetchedGames = await fetchChesscomGames(username, year, month);
            let chronologicallyOrderedGames = fetchedGames.reverse();
            setGames(chronologicallyOrderedGames);
        } catch (error) {
            setError('Failed to fetch sidebar. Please check the username and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGameSelect = (game) => {
        loadChesscomGame(game);
        setUsernameGameResult(getUsernameGameResult(game, username));
        closeSidebar();
    };

    return (
        <div className="flex flex-col gap-4">
            <ChesscomImportForm
                username={username}
                setUsername={setUsername}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                handleFetchGames={handleFetchGames}
                isLoading={isLoading}
            />

            {error && (
                <div className="text-rose-400 text-sm">
                    {error}
                </div>
            )}

            {games.length > 0 && (
                <GamesList
                    games={games}
                    username={username}
                    handleGameSelect={handleGameSelect}
                    getUsernameGameResult={getUsernameGameResult}
                />
            )}
        </div>
    );
}