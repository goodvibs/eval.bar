import { useState, useCallback } from 'react';

/**
 * Custom hook that contains all the logic for the AllContent component
 *
 * @returns {Object} State and handlers for the AllContent component
 */
export function useAllContent() {
    // Sidebar state
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Handlers
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            if (isSidebarOpen) {
                setSidebarOpen(false);
            }
        }
    }, [isSidebarOpen]);

    const handleOpenSidebar = useCallback(() => {
        setSidebarOpen(true);
    }, []);

    const handleCloseSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    // Return all state and handlers needed by the component
    return {
        // State
        isSidebarOpen,

        // Event handlers
        handleKeyDown,
        handleOpenSidebar,
        handleCloseSidebar
    };
}