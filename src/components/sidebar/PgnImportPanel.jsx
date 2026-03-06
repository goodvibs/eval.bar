import React, { useRef } from 'react';
import { useLoadGame } from '../../hooks/stores/useGameStore';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { UploadIcon } from '../ui/icons/UploadIcon';
import { TrashIcon } from '../ui/icons/TrashIcon';

export function PgnImportPanel({ show, closeSidebar }) {
    const [pgnText, setPgnText] = React.useState('');
    const [error, setError] = React.useState('');
    const fileInputRef = useRef(null);
    const { loadPgnGame } = useLoadGame();

    const handleFileSelect = e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const content = ev.target?.result;
                if (typeof content === 'string') {
                    loadPgnGame(content);
                    closeSidebar();
                }
            } catch (err) {
                setError('Invalid PGN format. Please check your file.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleImport = e => {
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
        <form onSubmit={handleImport} className={`${show ? 'flex' : 'hidden'} flex-col gap-4`}>
            <input
                ref={fileInputRef}
                type="file"
                accept=".pgn,text/plain"
                onChange={handleFileSelect}
                className="hidden"
            />
            <label htmlFor="pgn-input" className="flex flex-col gap-2">
                <span className="text-sm lg:text-xs font-medium text-slate-300">
                    Paste PGN (Portable Game Notation)
                </span>
                <Textarea
                    id="pgn-input"
                    value={pgnText}
                    onChange={e => {
                        setPgnText(e.target.value);
                        setError(''); // Clear error when input changes
                    }}
                    placeholder="1. e4 e5 2. Nf3 Nc6 ..."
                    className="h-48 min-h-48 text-base"
                />
            </label>

            {error && (
                <div role="alert" className="text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-1 text-lg tracking-tight"
                    >
                        Import Game
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClear}
                        icon={<TrashIcon className="w-4 h-4" />}
                    >
                        Clear
                    </Button>
                </div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-slate-600 border-dashed text-slate-300 hover:border-slate-500 hover:bg-slate-700/50 transition-colors"
                >
                    <UploadIcon className="w-4 h-4" />
                    Upload PGN file
                </button>
            </div>
        </form>
    );
}
