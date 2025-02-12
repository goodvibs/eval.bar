export function PGNImport() {
    return (
        <div className="flex-col gap-4 rounded overflow-hidden">
            <label className="flex flex-col gap-2 text-slate-300 font-bold">
                Paste game link or PGN
                <textarea
                    placeholder="1.e4 e5 2.Nf3 Nf6..."
                    className="p-1 bg-slate-500 rounded font-normal text-slate-50"
                />
            </label>
            <button
                className="flex flex-1 bg-green-600 text-slate-50 rounded p-2 justify-center hover:bg-green-700 transition duration-100 disabled:opacity-50 disabled:hover:bg-green-600"
                type="submit"
            >
                Import
            </button>
        </div>
    );
}