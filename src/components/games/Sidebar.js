import {TabButton} from "./TabButton";
import React from "react";
import {ChesscomPanel} from "./ChesscomPanel";
import {PGNImport} from "./PGNImport";

export function Sidebar({ isOpen, onOpen, onClose }) {  // Separate open and close actions
    const [currTab, setCurrTab] = React.useState(0);

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`
                fixed inset-0 
                bg-black pointer-events-none
                transition-all duration-1000
                lg:hidden
                z-30
                ${isOpen ? 'bg-opacity-50 pointer-events-auto' : 'bg-opacity-0'}
                `}
                onClick={onClose}
            />

            {/* Sidebar wrapper with tab */}
            <aside className={`
                fixed lg:relative lg:block
                inset-y-0 left-0 w-full lg:w-72
                ${isOpen ? 'outline outline-1 outline-slate-500' : ''}
                z-40 lg:z-0
                transform transition-transform duration-1000
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Pull-out tab - only for opening */}
                <button
                    onClick={onOpen}
                    className={`
                        lg:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border border-l-0 border-slate-500
                        bg-slate-700 hover:bg-slate-600 text-slate-200
                        p-2 rounded-r-lg
                    `}
                    aria-label="Open menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        viewBox="0 -960 960 960"
                        className="fill-current"
                    >
                        <path d="M360-160v-640q0-17 11.5-28.5T400-840q17 0 28.5 11.5T440-800v640q0 17-11.5 28.5T400-120q-17 0-28.5-11.5T360-160Zm160-168v-304q0-14 12-19t22 5l138 138q12 12 12 28t-12 28L554-314q-10 10-22 5t-12-19Z" />
                    </svg>
                </button>

                <div className="h-full bg-slate-700 flex flex-col overflow-hidden p-4 gap-4">
                    {/* X button - only for closing */}
                    <div className="flex items-center justify-end">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-600 rounded-full"
                            aria-label="Close menu"
                        >
                            <svg
                                className="lg:hidden w-6 h-6 text-slate-200"
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
                    <div className="flex w-full flex-col gap-4 text-slate-50 overflow-y-auto">
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