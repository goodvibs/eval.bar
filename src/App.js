import React from "react";
import { MainContent } from "./components/MainContent";
import {useStockfish} from "./hooks/useStockfish";

export default function App() {
    useStockfish();

    return (
        <MainContent />
    );
}