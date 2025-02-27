import {useGameStore} from "../../hooks/stores/useGameStore";
import React from "react";

export function PgnImportPanel({ closeSidebar }) {
    const [pgnText, setPgnText] = React.useState('');
    const [error, setError] = React.useState('');
    const { loadPgnGame } = useGameStore();

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
        <form onSubmit={handleImport} className="flex flex-col gap-4">
            <label htmlFor="pgn-input" className="flex flex-col gap-2">
                <span className="text-sm lg:text-xs font-medium text-slate-300">
                    Paste PGN
                </span>
                <textarea
                    id="pgn-input"
                    value={pgnText}
                    onChange={(e) => {
                        setPgnText(e.target.value);
                        setError(''); // Clear error when input changes
                    }}
                    placeholder="1. e4 e5 2. Nf3 Nc6 ..."
                    className="h-48 p-2 bg-slate-800 rounded text-slate-200 border border-slate-600 outline-none resize-none font-mono text-sm"
                />
            </label>

            {error && (
                <div role="alert" className="text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-slate-100 p-2 rounded hover:bg-emerald-500 active:bg-emerald-700 transition-colors"
                >
                    Import Game
                </button>
                <button
                    type="button" // Explicitly set type to button to prevent form submission
                    onClick={handleClear}
                    className="px-3 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded transition-colors"
                >
                    Clear
                </button>
            </div>
        </form>
    );
}