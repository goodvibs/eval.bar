import Collapsible from "../Collapsible";

export function ImportByUsername({
                                     currCollapsible,
                                     setCurrCollapsible,
                                     importSource,
                                     setImportSource,
                                     importSourcesPretty
                                 }) {
    return (
        <div className="flex flex-col bg-slate-600 rounded overflow-hidden">
            <Collapsible
                label="Import from"
                currCollapsible={currCollapsible}
                setCurrCollapsible={setCurrCollapsible}
                selected={importSourcesPretty[importSource]}
                innerJSX={
                    <div className="flex flex-col text-slate-50 px-4">
                        <label className="flex gap-2 items-center">
                            <input
                                type="radio"
                                value="chess.com"
                                name="importSource"
                                onChange={(e) => setImportSource(e.target.value === "chess.com" ? 0 : -1)}
                            />
                            Chess.com
                        </label>
                        <label className="flex gap-2 items-center">
                            <input
                                type="radio"
                                value="lichess.org"
                                name="importSource"
                                onChange={(e) => setImportSource(e.target.value === "lichess.org" ? 1 : -1)}
                            />
                            Lichess.org
                        </label>
                    </div>
                }
            />
        </div>
    );
}