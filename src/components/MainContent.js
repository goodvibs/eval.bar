import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
import { EvaluationBar } from "./EvaluationBar";
import { GameArea } from "./GameArea";
import { Sidebar } from "./games/Sidebar";
import { useGameStore } from "../stores/gameStore";
import { fetchChesscomGame } from "../utils/chesscom";
import { checkExtensionInstalled } from "../utils/extension";
import {LoadingOverlay} from "./LoadingOverlay";
import {ExtensionPrompt} from "./ExtensionPrompt";

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

export function MainContent() {
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [extensionPromptHidden, setExtensionPromptHidden] = React.useState(true);

    const { loadGame } = useGameStore();
    const location = useLocation();
    const navigate = useNavigate();

    // Handle keyboard events for accessibility
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            if (isSidebarOpen) {
                setSidebarOpen(false);
            } else if (!extensionPromptHidden) {
                setExtensionPromptHidden(true);
            }
        }
    };

    // Check for chess.com game URLs
    React.useEffect(() => {
        // Handle import with extension
        const handleImportWithExtension = (gameType, gameId) => {
            // This is a placeholder - the actual implementation would be in your extension
            console.log(`Using extension to import ${gameType} game ${gameId}`);

            // If for some reason extension import fails, fall back to direct import
            // This could happen if the extension is installed but not working properly
            // We'll simulate a successful import here
            setLoading(true);

            // Simulate extension importing the game
            setTimeout(() => {
                // In a real implementation, the extension would call a callback or post a message
                // after loading the PGN
                setLoading(false);
            }, 1000);
        };

        // Handle direct import (without extension)
        const handleDirectImport = async (gameType, gameId) => {
            try {
                setLoading(true);
                setError(null);

                // Try to fetch and process the game directly
                const result = await fetchChesscomGame(gameType, gameId);

                // Load the game into the store
                loadGame(result.pgn);

                setLoading(false);
            } catch (error) {
                console.error('Error importing game:', error);

                // If direct import fails due to CORS, show extension prompt
                if (error.message?.includes('CORS') ||
                    error.message?.includes('network') ||
                    error.message?.includes('access control checks')) {
                    setExtensionPromptHidden(false);
                } else {
                    // Show other errors directly
                    setError(error.message || 'Error importing game');
                }

                setLoading(false);
            }
        };

        const gameInfo = parseChesscomGameUrl(location.pathname);

        if (gameInfo) {
            console.log("Game info detected:", gameInfo);

            // Check if extension is installed
            checkExtensionInstalled()
                .then(result => {
                    console.log("Extension check result:", result);
                    if (result.installed) {
                        console.log("Extension is installed, using it for import");
                        handleImportWithExtension(gameInfo.type, gameInfo.id);
                    } else {
                        console.log("Extension not installed, showing prompt");
                        // Show extension prompt immediately if extension is not installed
                        setExtensionPromptHidden(false);
                    }
                })
                .catch(err => {
                    console.error("Error checking extension:", err);
                    // If extension check fails, assume extension is not installed and show prompt
                    setExtensionPromptHidden(false);
                });

            // Clear the URL to avoid reimporting on refresh
            navigate('/', { replace: true });
        }
    }, [loadGame, location.pathname, navigate]);

    // Close the loading overlay
    const handleCloseOverlay = () => {
        setLoading(false);
        setError(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-700" onKeyDown={handleKeyDown}>
            <Navigation onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
            <EvaluationBar />

            <div className="flex items-center justify-center lg:items-start overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onOpen={() => setSidebarOpen(true)}
                    onClose={() => setSidebarOpen(false)}
                />

                <GameArea />
            </div>

            {/* Loading overlay */}
            {loading && (
                <LoadingOverlay
                    message="Importing your Chess.com game..."
                    error={error}
                    onClose={handleCloseOverlay}
                />
            )}

            {/* Extension prompt */}
            <ExtensionPrompt hidden={extensionPromptHidden} close={() => setExtensionPromptHidden(true)} />
        </div>
    );
}