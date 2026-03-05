import React, { useCallback, useEffect, useRef } from 'react';
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

    const hasAutoFetchedRef = useRef(false);
    const hasSyncedFromStoreRef = useRef(false);

    // Sync local username once when persisted store hydrates (don't overwrite user input)
    useEffect(() => {
        if (chesscomUsername && !hasSyncedFromStoreRef.current) {
            hasSyncedFromStoreRef.current = true;
            setChesscomUsernameLocal(chesscomUsername);
        }
    }, [chesscomUsername]);

    const fetchGames = useCallback(async (username, date) => {
        if (!username || !date) return;
        setIsLoading(true);
        setError(null);
        try {
            const [year, month] = date.split('-');
            const fetchedGames = await fetchChesscomGames(username, year, month);
            setGames(fetchedGames.toReversed());
            setChesscomUsername(username);
        } catch (err) {
            setError('Failed to fetch games. Please check the username and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [setChesscomUsername]);

    const fetchAndUpdateGames = useCallback(
        async e => {
            if (e) e.preventDefault();
            fetchGames(chesscomUsernameLocal, selectedDate);
        },
        [fetchGames, chesscomUsernameLocal, selectedDate]
    );

    // Auto-fetch on mount when autoRetrieveGames is true and we have a username (from store or after hydration)
    useEffect(() => {
        if (
            autoRetrieveGames &&
            chesscomUsername &&
            selectedDate &&
            !hasAutoFetchedRef.current
        ) {
            hasAutoFetchedRef.current = true;
            fetchGames(chesscomUsername, selectedDate);
        }
    }, [autoRetrieveGames, chesscomUsername, selectedDate, fetchGames]);

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
