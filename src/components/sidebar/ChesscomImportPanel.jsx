import React from 'react';
import { fetchChesscomGames } from '../../utils/chesscom';
import { ChesscomImportForm } from './ChesscomImportForm';
import { GamesList } from './GamesList';
import { useChesscomConfigStore } from '../../hooks/stores/useChesscomConfigStore';
import { useLoadGame } from '../../hooks/stores/useGameStore';

// Get current date and format it as YYYY-MM
const getCurrentYearMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export function ChesscomImportPanel({ show, closeSidebar }) {
    const { loadChesscomGame } = useLoadGame();
    const { chesscomUsername, setChesscomUsername, autoRetrieveGames } = useChesscomConfigStore();

    const [games, setGames] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const [chesscomUsernameLocal, setChesscomUsernameLocal] = React.useState(chesscomUsername);
    const [selectedDate, setSelectedDate] = React.useState(getCurrentYearMonth());

    const fetchAndUpdateGames = async e => {
        // If called from a form submission, prevent default behavior
        if (e) e.preventDefault();

        if (!chesscomUsernameLocal || !selectedDate) return;

        setIsLoading(true);
        setError(null);

        try {
            const [year, month] = selectedDate.split('-');
            const fetchedGames = await fetchChesscomGames(chesscomUsernameLocal, year, month);
            let chronologicallyOrderedGames = fetchedGames.toReversed();
            setGames(chronologicallyOrderedGames);
            setChesscomUsername(chesscomUsernameLocal);
        } catch (error) {
            setError('Failed to fetch games. Please check the username and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (autoRetrieveGames) {
            fetchAndUpdateGames();
        }
    }, []);

    const handleGameSelect = game => {
        loadChesscomGame(game);
        closeSidebar();
    };

    return (
        <div className={`${show ? 'flex' : 'hidden'} flex-col gap-4`}>
            <ChesscomImportForm
                username={chesscomUsernameLocal}
                setUsername={setChesscomUsernameLocal}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                handleFetchGames={fetchAndUpdateGames}
                isLoading={isLoading}
            />

            {error && <div className="flex justify-center text-rose-400 text-sm">{error}</div>}

            <GamesList
                games={games}
                username={chesscomUsernameLocal}
                handleGameSelect={handleGameSelect}
            />
        </div>
    );
}
