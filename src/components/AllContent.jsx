import React, { memo } from 'react';
import { NavigationBar } from './navigation/NavigationBar';
import { EvaluationBar } from './EvaluationBar';
import { Sidebar } from './sidebar/Sidebar';
import { MainContent } from './MainContent';
import { useAllContent } from '../hooks/useAllContent';

/**
 * AllContent component that acts as the main layout container for the application.
 * All logic has been moved to the useAllContent custom hook.
 */
export const AllContent = memo(function AllContent() {
    console.log('AllContent rendered');

    // Get all state and handlers from the custom hook
    const { isSidebarOpen, handleKeyDown, handleOpenSidebar, handleCloseSidebar } = useAllContent();

    return (
        <div className="flex flex-col min-h-screen bg-slate-700" onKeyDown={handleKeyDown}>
            <NavigationBar />
            <EvaluationBar />

            <div className="flex flex-col lg:flex-row w-full flex-grow overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onOpen={handleOpenSidebar}
                    onClose={handleCloseSidebar}
                />

                <MainContent />
            </div>
        </div>
    );
});
