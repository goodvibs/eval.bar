import {useGameStore} from "../../stores/gameStore";
import React from "react";
import {Chess} from "chess.js";

export function PGNImport() {
    const [pgnText, setPgnText] = React.useState('');
    const [error, setError] = React.useState('');
    const { loadGame } = useGameStore();

    const handleImport = () => {
        try {
            // Try to create a new chess instance with the PGN to validate it
            const chess = new Chess();
            chess.loadPgn(pgnText);

            // If we get here, PGN was valid
            loadGame(pgnText);
            setPgnText('');
            setError('');
        } catch (err) {
            setError('Invalid PGN format. Please check your input.');
            console.error('PGN parsing error:', err);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
                <span className="text-sm lg:text-xs font-medium text-slate-300">
                    Paste PGN
                </span>
                <textarea
                    value={pgnText}
                    onChange={(e) => {
                        setPgnText(e.target.value);
                        setError(''); // Clear error when input changes
                    }}
                    placeholder="1. e4 e5 2. Nf3 Nc6 ..."
                    className="h-48 p-2 bg-slate-800 rounded text-slate-200 border border-slate-600 resize-none font-mono text-sm"
                />
            </label>

            {error && (
                <div className="text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={handleImport}
                    className="flex-1 bg-emerald-600 text-slate-100 p-2 rounded hover:bg-emerald-500 transition-colors"
                >
                    Import Game
                </button>
                <button
                    onClick={() => {
                        setPgnText('');
                        setError('');
                    }}
                    className="px-3 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded transition-colors"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}