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
    // Get all state and handlers from the custom hook
    const { isSidebarOpen, handleOpenSidebar, handleCloseSidebar } = useAllContent();

    return (
        <div className="flex flex-col min-h-screen bg-slate-700">
            <a
                href="#main-content"
                className="absolute left-[-9999px] focus:left-4 focus:top-4 focus:z-[50] focus:px-4 focus:py-2 focus:bg-slate-800 focus:text-slate-100 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
                Skip to main content
            </a>
            <NavigationBar />
            <EvaluationBar />

            <div className="flex flex-col lg:flex-row w-full flex-grow overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onOpen={handleOpenSidebar}
                    onClose={handleCloseSidebar}
                />

                <MainContent onOpenSidebar={handleOpenSidebar} />
            </div>
        </div>
    );
});
