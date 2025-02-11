import { create } from 'zustand';
import {useGameStore} from "./gameStore";

export const useImportStore = create((set, get) => ({
    source: null,
    username: '',
    selectedDate: '',
    games: [],
    activeCollapsible: '',
    isLoading: false,
    error: null,

    setSource: (source) => set({ source }),
    setUsername: (username) => set({ username }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    setGames: (games) => set({ games }),
    toggleCollapsible: (section) => set(state => ({
        activeCollapsible: state.activeCollapsible === section ? '' : section
    })),

    // Fetch games from chess platforms
    fetchGames: async () => {
        const { source, username, selectedDate } = get();
        if (!source || !username) return;

        set({ isLoading: true, error: null });

        try {
            let games = [];
            if (source === 'chess.com') {
                const response = await fetch(
                    `https://api.chess.com/pub/player/${username}/games/${
                        selectedDate.replace('-', '/')
                    }`
                );
                const data = await response.json();
                games = data.games.map(game => ({
                    id: game.url,
                    pgn: game.pgn,
                    white: game.white.username,
                    black: game.black.username,
                    result: game.result,
                    date: new Date(game.end_time * 1000).toLocaleDateString()
                }));
            } else if (source === 'lichess') {
                const response = await fetch(
                    `https://lichess.org/api/games/user/${username}?max=50${
                        selectedDate ? `&since=${new Date(selectedDate).getTime()}` : ''
                    }`
                );
                const text = await response.text();
                games = text.split('\n')
                    .filter(line => line)
                    .map(game => {
                        const pgn = game;
                        // Parse PGN headers for metadata
                        const white = pgn.match(/\[White "(.+?)"\]/)?.[1] || '';
                        const black = pgn.match(/\[Black "(.+?)"\]/)?.[1] || '';
                        const result = pgn.match(/\[Result "(.+?)"\]/)?.[1] || '';
                        const date = pgn.match(/\[Date "(.+?)"\]/)?.[1] || '';
                        return { id: date + white + black, pgn, white, black, result, date };
                    });
            }

            set({ games, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Load selected game into game store
    loadSelectedGame: (gameId) => {
        const { games } = get();
        const selectedGame = games.find(game => game.id === gameId);
        if (selectedGame) {
            useGameStore.getState().loadGame(selectedGame.pgn);
        }
    }
}));