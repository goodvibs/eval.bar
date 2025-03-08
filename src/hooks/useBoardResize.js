import { useState, useEffect } from 'react';
import { useGameMetadata } from './stores/useGameStore';

/**
 * Custom hook to handle chessboard and right panel resizing based on available screen space
 * @returns {Object} Containing containerRef, boardWidth, and rightPanelWidth
 */
export function useBoardResize() {
    const headerHeight = 160;
    const minBoardSize = 310;
    const minRightPanelWidth = 300;
    const padding = 30;
    const [boardWidth, setBoardWidth] = useState(500);
    const [rightPanelWidth, setRightPanelWidth] = useState(300);

    const gameMetadata = useGameMetadata();

    useEffect(() => {
        const updateSize = () => {
            // Calculate available height
            const metadataHeight = gameMetadata?.white ? 60 : 0;
            const availableHeight = Math.max(
                window.innerHeight - headerHeight - metadataHeight,
                minBoardSize
            );

            // Calculate available width, accounting for sidebar on larger screens
            const isScreenLarge = window.innerWidth >= 1024;
            const sidebarWidth = isScreenLarge ? 300 : 0;

            const availableWidth = window.innerWidth - sidebarWidth - 2 * padding;

            const idealBoardWidth = Math.min(availableHeight, availableWidth);

            if (availableWidth >= idealBoardWidth + minRightPanelWidth) {
                setBoardWidth(idealBoardWidth);
                const rightPanelWidth = availableWidth - idealBoardWidth;
                setRightPanelWidth(rightPanelWidth);
            } else if (availableWidth >= minBoardSize + minRightPanelWidth) {
                // reduce board width to fit right panel
                const rightPanelWidth = minRightPanelWidth;
                setRightPanelWidth(rightPanelWidth);
                setBoardWidth(availableWidth - rightPanelWidth);
            } else {
                // wrap right panel to new line
                setBoardWidth(idealBoardWidth);
                setRightPanelWidth(window.innerWidth - padding);
            }
        };

        // Initial calculation
        updateSize();

        // Update on window resize
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [gameMetadata?.white, headerHeight, minBoardSize, padding, minRightPanelWidth]);

    return { boardWidth, rightPanelWidth };
}
