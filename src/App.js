import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainContent } from "./components/MainContent";
import EngineProvider from "./components/EngineProvider";

export default function App() {
    return (
        <BrowserRouter>
            <EngineProvider>
                <Routes>
                    {/* Main analysis board route */}
                    <Route path="/" element={<MainContent />} />

                    {/* Chess.com game import routes */}
                    <Route path="/game/live/:gameId" element={<MainContent />} />
                    <Route path="/game/daily/:gameId" element={<MainContent />} />

                    {/* All other routes redirect to home */}
                    <Route path="*" element={<MainContent />} />
                </Routes>
            </EngineProvider>
        </BrowserRouter>
    );
}