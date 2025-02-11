import {useImportStore} from "../../stores/importStore";
import Collapsible from "../Collapsible";

export function UsernameSelect() {
    const {
        username,
        setUsername,
        activeCollapsible,
        toggleCollapsible,
        fetchGames
    } = useImportStore();

    return (
        <Collapsible
            label="Played by"
            currCollapsible={activeCollapsible}
            setCurrCollapsible={() => toggleCollapsible('username')}
            selected={username || "Player 1"}
            innerJSX={
                <div className="flex flex-1 flex-col py-4 gap-2">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter a username"
                        className="p-1 bg-slate-500 rounded text-slate-50"
                    />
                    <button
                        onClick={fetchGames}
                        className="flex justify-center bg-teal-600 text-slate-50 p-2 rounded hover:bg-teal-700
                     transition duration-100 disabled:opacity-50 disabled:hover:bg-teal-600"
                        disabled={!username}
                    >
                        Fetch games
                    </button>
                </div>
            }
        />
    );
}