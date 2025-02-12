export function GameLibrary() {
    return (
        <div className="flex flex-1 flex-col gap-2 text-slate-50 overflow-y-scroll">
            <button className="flex justify-between bg-slate-600 hover:bg-slate-500 p-2 rounded">
                Untitled game
                <span className="flex text-slate-400">12/29/2022</span>
            </button>
            <button className="flex justify-between bg-slate-600 hover:bg-slate-500 p-2 rounded">
                Positional London
                <span className="flex text-slate-400">12/26/2022</span>
            </button>
        </div>
    );
}