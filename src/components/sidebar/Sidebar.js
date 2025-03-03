import {SidebarTabButton} from "./SidebarTabButton";
import React from "react";
import {ChesscomImportPanel} from "./ChesscomImportPanel";
import {PgnImportPanel} from "./PgnImportPanel";

export function Sidebar({ isOpen, onOpen, onClose, height }) {
    const [currTab, setCurrTab] = React.useState(0);

    return (
        <>
            {/* Mobile overlay - only visible on small screens */}
            <div
                className={`
                fixed inset-0 
                bg-black pointer-events-none
                transition-all duration-1000
                lg:hidden
                z-30
                ${isOpen ? 'backdrop-blur bg-opacity-50 pointer-events-auto' : 'bg-opacity-0'}
                `}
                onClick={onClose}
            />

            {/* Sidebar wrapper - fixed on mobile, flex item on desktop */}
            <aside
                className={`
                fixed lg:static 
                inset-y-0 lg:inset-auto left-0
                w-full lg:w-auto
                min-w-0 lg:min-w-72
                lg:flex lg:flex-col lg:flex-grow
                bg-slate-700
                ${isOpen ? 'outline outline-1 outline-slate-500 lg:outline-none' : ''}
                z-40
                transform transition-transform duration-1000 lg:transform-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Pull-out tab - only for opening on mobile */}
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

                <div className="flex flex-col p-4 lg:pr-3 gap-4 h-full overflow-y-auto lg:overflow-y-auto scrollbar-track-transparent">
                    {/* Mobile header with close button */}
                    <div className="flex lg:hidden items-center justify-between py-4">
                        <h1 className="flex justify-center font-medium text-2xl text-slate-200">
                            Import a Chess Game
                        </h1>
                        <div className="flex items-center justify-end">
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
                    </div>

                    {/* Sidebar content */}
                    <div className="flex flex-1 flex-col gap-4 text-slate-100">
                        <div className="flex gap-1 border-b border-slate-600">
                            <SidebarTabButton
                                active={currTab === 0}
                                label="Chess.com"
                                onClick={() => setCurrTab(0)}
                            />
                            <SidebarTabButton
                                active={currTab === 1}
                                label="PGN"
                                onClick={() => setCurrTab(1)}
                            />
                        </div>
                        <ChesscomImportPanel show={currTab === 0} closeSidebar={onClose} />
                        <PgnImportPanel show={currTab === 1} closeSidebar={onClose} />
                    </div>
                </div>
            </aside>
        </>
    );
}