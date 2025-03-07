import React from "react";
import {useLoadGame} from "../../hooks/stores/useGameStore";

export function PgnImportPanel({ show, closeSidebar }) {
    const [pgnText, setPgnText] = React.useState('');
    const [error, setError] = React.useState('');
    const { loadPgnGame } = useLoadGame();

    const handleImport = (e) => {
        // Prevent default form submission behavior
        e.preventDefault();

        if (!pgnText.trim()) {
            setError('Please enter PGN text.');
            return;
        }

        try {
            loadPgnGame(pgnText);
            setError('');

            closeSidebar();
        } catch (err) {
            setError('Invalid PGN format. Please check your input.');
            console.error('PGN parsing error:', err);
        }
    };

    const handleClear = () => {
        setPgnText('');
        setError('');
    };

    return (
        <form onSubmit={handleImport} className={`${show ? "flex" : "hidden"} flex-col gap-4`}>
            <label htmlFor="pgn-input" className="flex flex-col gap-2">
                <span className="text-sm lg:text-xs font-medium text-slate-300">
                    Paste PGN (Portable Game Notation)
                </span>
                <textarea
                    id="pgn-input"
                    value={pgnText}
                    onChange={(e) => {
                        setPgnText(e.target.value);
                        setError(''); // Clear error when input changes
                    }}
                    placeholder="1. e4 e5 2. Nf3 Nc6 ..."
                    className="h-48 min-h-48 p-2 bg-slate-800 rounded-lg text-base text-slate-200 border border-slate-600 outline-none font-mono"
                />
            </label>

            {error && (
                <div role="alert" className="text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-1">
                <button
                    type="submit"
                    className="flex-1 bg-emerald-600 transition-all text-lg font-semibold tracking-tight text-slate-100 py-2 rounded-lg hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600"
                >
                    Import Game
                </button>
                <button
                    type="button" // Explicitly set type to button to prevent form submission
                    onClick={handleClear}
                    className="px-3 py-2 text-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded transition-colors"
                >
                    Clear
                </button>
            </div>
        </form>
    );
}