import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { NavigationBar } from "./navigation/NavigationBar";
import { EvaluationBar } from "./EvaluationBar";
import { Sidebar } from "./sidebar/Sidebar";
import { LoadingOverlay } from "./LoadingOverlay";
import { ExtensionPrompt } from "./ExtensionPrompt";
import { GameMetadata } from "./GameMetadata";
import { ChessboardPanel } from "./chessboard/ChessboardPanel";
import { AnalysisPanel } from "./analysis/AnalysisPanel";
import { MoveHistoryPanel } from "./moves/MoveHistoryPanel";
import { useBoardResize } from "../hooks/useBoardResize";
import { useChessGameImport } from "../hooks/useUrlImport"; // New custom hook

export function MainContent() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const mainRef = useRef(null);
    const [mainHeight, setMainHeight] = useState(500);

    // Use our new custom hook
    const {
        loading,
        error,
        showExtensionPrompt,
        setLoading,
        setError,
        setShowExtensionPrompt
    } = useChessGameImport(location.pathname);

    // Handle keyboard events for accessibility
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            if (isSidebarOpen) {
                setSidebarOpen(false);
            } else if (showExtensionPrompt) {
                setShowExtensionPrompt(false);
            }
        }
    }, [isSidebarOpen, showExtensionPrompt, setShowExtensionPrompt]);

    const updateSidebarHeight = useCallback(() => {
        if (mainRef.current && window.innerWidth >= 1024) {
            setMainHeight(mainRef.current.offsetHeight);
        }
    }, []);

    // Set up resize observer to track main content height changes
    useEffect(() => {
        const resizeObserver = new ResizeObserver(updateSidebarHeight);

        if (mainRef.current) {
            resizeObserver.observe(mainRef.current);
            updateSidebarHeight(); // Initial measurement
        }

        window.addEventListener('resize', updateSidebarHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateSidebarHeight);
        };
    }, [updateSidebarHeight]);

    // Close the loading overlay
    const handleCloseOverlay = useCallback(() => {
        setLoading(false);
        setError(null);
    }, [setLoading, setError]);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const { boardWidth, rightPanelWidth } = useBoardResize({
        rightPanelPercent: 30 // 30% of remaining space for right panel
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-700" onKeyDown={handleKeyDown}>
            <NavigationBar onMenuClick={toggleSidebar} />
            <EvaluationBar />

            {/* Main layout container */}
            <div className="flex flex-col lg:flex-row w-full flex-grow overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onOpen={() => setSidebarOpen(true)}
                    onClose={() => setSidebarOpen(false)}
                    height={mainHeight}
                />

                {/* Main content area */}
                <div className="flex flex-col flex-grow overflow-hidden">
                    <main
                        ref={mainRef}
                        className="flex justify-center flex-wrap gap-4 lg:pl-1 p-4 min-h-[calc(100vh-3rem)] overflow-auto"
                    >
                        {/* Chess board section */}
                        <div className="flex h-fit flex-col gap-4">
                            <GameMetadata />
                            <ChessboardPanel boardWidth={boardWidth} />
                        </div>

                        {/* Analysis section */}
                        <div
                            className="flex flex-col min-w-72 gap-4"
                            style={{ width: rightPanelWidth }}
                        >
                            <AnalysisPanel />
                            <MoveHistoryPanel />
                        </div>
                    </main>
                </div>
            </div>

            {/* Overlays */}
            {loading && (
                <LoadingOverlay
                    message="Importing your Chess.com game..."
                    error={error}
                    onClose={handleCloseOverlay}
                />
            )}

            <ExtensionPrompt
                hidden={!showExtensionPrompt}
                close={() => setShowExtensionPrompt(false)}
            />
        </div>
    );
}