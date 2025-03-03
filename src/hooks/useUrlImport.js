import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchChesscomGame } from '../utils/chesscom';
import { checkExtensionInstalled } from '../utils/extension';
import { useGameStore } from './stores/useGameStore';

// Parse chess.com game URL to extract type and ID
export const parseChesscomGameUrl = (pathname) => {
    // Match patterns like /game/live/123456789 or /game/daily/123456789
    const matches = pathname.match(/\/game\/(live|daily)\/(\d+)/);
    if (matches && matches.length === 3) {
        return {
            type: matches[1], // 'live' or 'daily'
            id: matches[2]    // the game ID
        };
    }
    return null;
};

export function useChessGameImport(pathname) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showExtensionPrompt, setShowExtensionPrompt] = useState(false);

    const { loadGame } = useGameStore();
    const navigate = useNavigate();

    useEffect(() => {
        const gameInfo = parseChesscomGameUrl(pathname);

        if (!gameInfo) return;

        const importGame = async () => {
            try {
                setLoading(true);
                setError(null);
                setShowExtensionPrompt(false);

                // Check if extension is installed
                const extensionResult = await checkExtensionInstalled();

                if (extensionResult.installed) {
                    // Handle extension-based import
                    // In a real implementation, this would communicate with the extension
                    console.log(`Using extension to import ${gameInfo.type} game ${gameInfo.id}`);

                    // Simulate extension importing the game
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                } else {
                    // Try direct import
                    try {
                        const result = await fetchChesscomGame(gameInfo.type, gameInfo.id);
                        loadGame(result.pgn);
                    } catch (importError) {
                        if (importError.message?.includes('CORS') ||
                            importError.message?.includes('network') ||
                            importError.message?.includes('access control checks')) {
                            setShowExtensionPrompt(true);
                        } else {
                            setError(importError.message || 'Error importing game');
                        }
                    }
                }
            } catch (checkError) {
                console.error("Error checking extension:", checkError);
                setShowExtensionPrompt(true);
            } finally {
                setLoading(false);
                // Clear the URL to avoid reimporting on refresh
                navigate('/', { replace: true });
            }
        };

        importGame();
    }, [pathname, loadGame, navigate]);

    return {
        loading,
        error,
        showExtensionPrompt,
        setLoading,
        setError,
        setShowExtensionPrompt
    };
}