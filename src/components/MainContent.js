import React, {useState, useRef, useCallback} from "react";
import { NavigationBar } from "./navigation/NavigationBar";
import { EvaluationBar } from "./EvaluationBar";
import { Sidebar } from "./sidebar/Sidebar";
import { GameMetadata } from "./GameMetadata";
import { ChessboardPanel } from "./chessboard/ChessboardPanel";
import { AnalysisPanel } from "./analysis/AnalysisPanel";
import { MoveHistoryPanel } from "./moves/MoveHistoryPanel";
import { useBoardResize } from "../hooks/useBoardResize";
import {usePositionSync} from "../hooks/usePositionSync";
import {useGameDerivedState} from "../hooks/stores/useGameStore";

export function MainContent() {
    console.log('MainContent');

    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const mainRef = useRef(null);

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

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const { boardWidth, rightPanelWidth } = useBoardResize();

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
        </div>
    );
}