import {TabButton} from "./TabButton";
import React from "react";
import {ChesscomPanel} from "./ChesscomPanel";
import {PGNImport} from "./PGNImport";

// components/games/Sidebar.jsx
export function Sidebar({ isOpen, onClose }) {
    const [currTab, setCurrTab] = React.useState(0);

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar wrapper */}
            <aside className={`
                fixed lg:relative lg:block
                inset-y-0 left-0 w-full lg:w-72
                z-40 lg:z-0
                transform transition-transform duration-500
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full bg-slate-700 flex flex-col overflow-hidden">
                    {/* Mobile header */}
                    <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-600">
                        <span className="text-lg font-semibold text-slate-200">Import Menu</span>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-600 rounded-full"
                            aria-label="Close menu"
                        >
                            <svg
                                className="w-6 h-6 text-slate-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Sidebar content */}
                    <div className="flex w-full flex-col gap-4 text-slate-50 p-4 lg:pr-0 overflow-y-auto">
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
                </div>
            </aside>
        </>
    );
}