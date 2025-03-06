import React from "react";
import { AllContent } from "./components/AllContent";
import {useStockfish} from "./hooks/useStockfish";

export default function App() {
    useStockfish();

    return (
        <AllContent />
    );
}