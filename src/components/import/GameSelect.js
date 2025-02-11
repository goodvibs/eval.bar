import {useImportStore} from "../../stores/importStore";

export function GameSelect() {
    const { games, isLoading, error, loadSelectedGame } = useImportStore();

    if (isLoading) {
        return (
            <div className="p-2 text-slate-300">
                Loading games...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-2 text-red-400">
                Error: {error}
            </div>
        );
    }

    if (!games.length) {
        return null;
    }

    return (
        <select
            className="p-2 bg-slate-500 rounded text-slate-50 w-full"
            onChange={(e) => loadSelectedGame(e.target.value)}
        >
            <option value="">Select a game</option>
            {games.map((game) => (
                <option key={game.id} value={game.id}>
                    {game.date} - {game.white} vs {game.black} ({game.result})
                </option>
            ))}
        </select>
    );
}