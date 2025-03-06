import React, { memo } from "react";
import { GameMetadata } from "./GameMetadata";
import { ChessboardPanel } from "./chessboard/ChessboardPanel";
import { AnalysisPanel } from "./analysis/AnalysisPanel";
import { MoveHistoryPanel } from "./moves/MoveHistoryPanel";
import { useMainContent } from "../hooks/useMainContent";

/**
 * MainContent component that handles the layout of the main content area.
 * All logic has been moved to the useMainContent custom hook.
 */
export const MainContent = memo(function MainContent() {
    console.log('MainContent rendered');

    // Get all state and refs from the custom hook
    const {
        mainRef,
        boardWidth,
        rightPanelStyle
    } = useMainContent();

    return (
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
                    style={rightPanelStyle}
                >
                    <AnalysisPanel />
                    <MoveHistoryPanel />
                </div>
            </main>
        </div>
    );
});