import {TabButton} from "./TabButton";
import React from "react";
import {ChesscomPanel} from "./ChesscomPanel";
import {PGNImport} from "./PGNImport";

export function Sidebar() {
    const [currTab, setCurrTab] = React.useState(0);

    return (
        <div className="flex w-96 flex-col gap-4 text-slate-50">
            <div className="flex gap-1 border-b border-slate-500">
                <TabButton
                    active={currTab === 0}
                    label="Chess.com"
                    onClick={() => setCurrTab(0)}
                />
                <TabButton
                    active={currTab === 1}
                    label="PGN"
                    onClick={() => setCurrTab(1)}
                />
            </div>
            {currTab === 0 && <ChesscomPanel />}
            {currTab === 1 && <PGNImport />}
        </div>
    );
}