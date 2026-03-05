import { useState, useEffect } from 'react';
import { useGameMetadata } from './stores/useGameStore';

const HEADER_HEIGHT = 160;
const MIN_BOARD_SIZE = 310;
const MIN_RIGHT_PANEL_WIDTH = 300;
const PADDING = 30;

/**
 * Custom hook to handle chessboard and right panel resizing based on available screen space
 * @returns {Object} Containing containerRef, boardWidth, and rightPanelWidth
 */
export function useBoardResize() {
    const [boardWidth, setBoardWidth] = useState(500);
    const [rightPanelWidth, setRightPanelWidth] = useState(300);

    const gameMetadata = useGameMetadata();

    useEffect(() => {
        const updateSize = () => {
            const metadataHeight = gameMetadata?.white ? 60 : 0;
            const availableHeight = Math.max(
                window.innerHeight - HEADER_HEIGHT - metadataHeight,
                MIN_BOARD_SIZE
            );

            const isScreenLarge = window.innerWidth >= 1024;
            const sidebarWidth = isScreenLarge ? 300 : 0;

            const availableWidth = window.innerWidth - sidebarWidth - 2 * PADDING;

            const idealBoardWidth = Math.min(availableHeight, availableWidth);

            if (availableWidth >= idealBoardWidth + MIN_RIGHT_PANEL_WIDTH) {
                setBoardWidth(idealBoardWidth);
                setRightPanelWidth(availableWidth - idealBoardWidth);
            } else if (availableWidth >= MIN_BOARD_SIZE + MIN_RIGHT_PANEL_WIDTH) {
                setRightPanelWidth(MIN_RIGHT_PANEL_WIDTH);
                setBoardWidth(availableWidth - MIN_RIGHT_PANEL_WIDTH);
            } else {
                setBoardWidth(idealBoardWidth);
                setRightPanelWidth(window.innerWidth - PADDING);
            }
        };

        updateSize();

        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [gameMetadata?.white]);

    return { boardWidth, rightPanelWidth };
}
