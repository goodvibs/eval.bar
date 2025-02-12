import React from "react";
import {Navigation} from "./components/Navigation";
import {EvaluationBar} from "./components/EvaluationBar";
import {GameArea} from "./components/GameArea";
import {Sidebar} from "./components/games/Sidebar";

export default function App() {

    return (
        <div className="flex flex-col min-h-screen bg-slate-700">
            <Navigation />
            <EvaluationBar />

            <div className="flex px-8 py-4 gap-8 justify-center">
                <Sidebar />
                <GameArea />
            </div>
        </div>
    );
}