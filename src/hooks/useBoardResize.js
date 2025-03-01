import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to handle chessboard resizing based on available screen space
 * @param {Object} options Configuration options
 * @param {Object} options.gameMetadata Game metadata for determining extra space needs
 * @param {number} options.headerHeight Height of the header/navbar in pixels
 * @param {number} options.sidebarWidth Width of the sidebar (on large screens) in pixels
 * @param {number} options.minBoardSize Minimum board size in pixels
 * @param {number} options.padding Padding to subtract from available space
 * @returns {Object} Containing containerRef and boardWidth
 */
export function useBoardResize({
                                   gameMetadata,
                                   headerHeight = 160,
                                   sidebarWidth = 610,
                                   minBoardSize = 300,
                                   padding = 30
                               }) {
    const [boardWidth, setBoardWidth] = useState(500);
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
            const useSidebar = window.innerWidth >= 1024;
            const availableWidth = window.innerWidth - (useSidebar ? sidebarWidth : 0) - padding;

            // Set board width to the smaller of available height or width
            const newSize = Math.min(availableHeight, availableWidth);
            setBoardWidth(newSize);
        };

        // Initial calculation
        updateSize();

        // Update on window resize
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [gameMetadata?.white, headerHeight, sidebarWidth, minBoardSize, padding]);

    return { containerRef, boardWidth };
}