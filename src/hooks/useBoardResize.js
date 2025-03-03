import { useState, useEffect, useRef } from 'react';
import {useGameStore} from "./stores/useGameStore";

/**
 * Custom hook to handle chessboard and right panel resizing based on available screen space
 * @param {Object} options Configuration options
 * @param {Object} options.gameMetadata Game metadata for determining extra space needs
 * @param {number} options.headerHeight Height of the header/navbar in pixels
 * @param {number} options.sidebarWidthPercent Width of the sidebar as percentage of screen width (on large screens)
 * @param {number} options.minBoardSize Minimum board size in pixels
 * @param {number} options.minRightPanelWidth Minimum width for the right panel in pixels
 * @param {number} options.padding Padding to subtract from available space
 * @param {number} options.rightPanelPercent Target percentage of available space for right panel (after sidebar)
 * @returns {Object} Containing containerRef, boardWidth, and rightPanelWidth
 */
export function useBoardResize({
                                   gameMetadata = useGameStore.getState().gameMetadata,
                                   headerHeight = 160,
                                   sidebarWidthPercent = 30,
                                   minBoardSize = 300,
                                   minRightPanelWidth = 300,
                                   padding = 30,
                                   rightPanelPercent = 30
                               }) {
    const [boardWidth, setBoardWidth] = useState(500);
    const [rightPanelWidth, setRightPanelWidth] = useState(300);
    const containerRef = useRef(null);

    useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;

            // Calculate available height
            const metadataHeight = gameMetadata?.white ? 60 : 0;
            const availableHeight = Math.max(
                window.innerHeight - headerHeight - metadataHeight,
                minBoardSize
            );

            // Calculate available width, accounting for sidebar on larger screens
            const isScreenLarge = window.innerWidth >= 1024;
            const sidebarWidth = isScreenLarge ? window.innerWidth * (sidebarWidthPercent / 100) : 0;

            const availableWidth = window.innerWidth - sidebarWidth - padding;

            // Set board width to the smaller of available height or width
            const idealBoardWidth = Math.min(availableHeight, availableWidth);

            if (availableWidth >= idealBoardWidth + minRightPanelWidth) {
                setBoardWidth(idealBoardWidth);
                const rightPanelWidth = availableWidth - idealBoardWidth;
                setRightPanelWidth(rightPanelWidth);
            }
            else {
                // reduce board width to fit right panel
                const rightPanelWidth = minRightPanelWidth;
                setRightPanelWidth(rightPanelWidth);
                setBoardWidth(availableWidth - rightPanelWidth);
            }
        };

        // Initial calculation
        updateSize();

        // Update on window resize
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [gameMetadata?.white, headerHeight, sidebarWidthPercent, minBoardSize, padding, rightPanelPercent, minRightPanelWidth]);

    return { containerRef, boardWidth, rightPanelWidth };
}