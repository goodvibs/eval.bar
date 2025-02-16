import React from "react";
import {Navigation} from "./components/Navigation";
import {EvaluationBar} from "./components/EvaluationBar";
import {GameArea} from "./components/GameArea";
import {Sidebar} from "./components/games/Sidebar";

export default function App() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Handle keyboard events for accessibility
    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-700" onKeyDown={handleKeyDown}>
            <Navigation onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            <EvaluationBar />

            <div className="flex items-center justify-center lg:items-start overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onOpen={() => setIsSidebarOpen(true)}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <GameArea />
            </div>
        </div>
    );
}