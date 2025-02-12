import {TabButton} from "./TabButton";
import {ImportPanel} from "../import/ImportPanel";
import {GameLibrary} from "./GameLibrary";
import React from "react";
import {useGameStore} from "../../stores/gameStore";
import {ChesscomPanel} from "./ChesscomPanel";

export function Sidebar() {
    const [currTab, setCurrTab] = React.useState(0);
    const { resetGame } = useGameStore();

    React.useEffect(() => {
        if (currTab === 0) {
            resetGame();
        }
    }, [currTab, resetGame]);

    return (
        <div className="flex flex-col gap-4 text-slate-50">
            <div className="flex gap-1 border-b border-slate-500">
                <TabButton
                    active={currTab === 0}
                    label="New Game"
                    onClick={() => setCurrTab(0)}
                />
                <TabButton
                    active={currTab === 1}
                    label="Chess.com"
                    onClick={() => setCurrTab(1)}
                />
                <TabButton
                    active={currTab === 2}
                    label="Import"
                    onClick={() => setCurrTab(2)}
                />
                <TabButton
                    active={currTab === 3}
                    label="Library"
                    onClick={() => setCurrTab(3)}
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
            {currTab === 1 && <ChesscomPanel />}
            {currTab === 2 && <ImportPanel />}
            {currTab === 3 && <GameLibrary />}
        </div>
    );
}