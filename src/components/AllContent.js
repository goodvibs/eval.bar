import React, {useState, useCallback} from "react";
import { NavigationBar } from "./navigation/NavigationBar";
import { EvaluationBar } from "./EvaluationBar";
import { Sidebar } from "./sidebar/Sidebar";
import {usePositionSync} from "../hooks/usePositionSync";
import {useGameDerivedState} from "../hooks/stores/useGameStore";
import {MainContent} from "./MainContent";

export function AllContent() {
    console.log('AllContent');

    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const { fen } = useGameDerivedState();
    usePositionSync({ currentFen: fen });

    // Handle keyboard events for accessibility
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            if (isSidebarOpen) {
                setSidebarOpen(false);
            }
        }
    }, [isSidebarOpen]);


    return (
        <div className="flex flex-col min-h-screen bg-slate-700" onKeyDown={handleKeyDown}>
            <NavigationBar />
            <EvaluationBar />

            <div className="flex flex-col lg:flex-row w-full flex-grow overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onOpen={() => setSidebarOpen(true)}
                    onClose={() => setSidebarOpen(false)}
                />

                <MainContent />
            </div>
        </div>
    );
}