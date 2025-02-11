import React from "react";
import {Navigation} from "./components/Navigation";
import {EvaluationBar} from "./components/EvaluationBar";
import {GameLibrary} from "./components/GameLibrary";
import {TabButton} from "./components/TabButton";
import {ImportPanel} from "./components/import/ImportPanel";
import {GameArea} from "./components/GameArea";
import {useGameStore} from "./stores/gameStore";

export default function App() {
    const [currTab, setCurrTab] = React.useState(0);
    const { resetGame } = useGameStore();

    // Reset game when switching to new game tab
    React.useEffect(() => {
        if (currTab === 0) {
            resetGame();
        }
    }, [currTab, resetGame]);

    return (
        <div className="flex flex-col min-h-screen bg-slate-900">
            <Navigation />
            <EvaluationBar />

            <div className="flex px-8 py-4 gap-8 flex-1">
                {/* Left sidebar */}
                <div className="w-64 flex flex-col gap-4 text-slate-50">
                    <div className="flex gap-1 border-b border-slate-600">
                        <TabButton
                            active={currTab === 0}
                            label="New Game"
                            onClick={() => setCurrTab(0)}
                        />
                        <TabButton
                            active={currTab === 1}
                            label="Import"
                            onClick={() => setCurrTab(1)}
                        />
                        <TabButton
                            active={currTab === 2}
                            label="Library"
                            onClick={() => setCurrTab(2)}
                        />
                    </div>

                    {currTab === 0 && (
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={resetGame}
                                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
                            >
                                Start New Game
                            </button>
                        </div>
                    )}
                    {currTab === 1 && <ImportPanel />}
                    {currTab === 2 && <GameLibrary />}
                </div>

                {/* Main game area */}
                <GameArea />
            </div>
        </div>
    );
}