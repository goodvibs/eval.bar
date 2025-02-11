import {useGameStore} from "../gameState";
import React from "react";

export function ShareButton() {
    const { currentFen } = useGameStore();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-slate-300 hover:text-white bg-slate-700 rounded"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-slate-700 rounded-lg shadow-lg p-4 z-10">
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                FEN
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={currentFen}
                                    readOnly
                                    className="flex-1 bg-slate-800 rounded px-2 py-1 text-sm text-slate-300"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(currentFen)}
                                    className="px-2 py-1 text-sm bg-slate-600 hover:bg-slate-500 rounded"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}