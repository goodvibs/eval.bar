import Collapsible from "../Collapsible";
import {useImportStore} from "../../stores/importStore";

export function ImportSourceSelect() {
    const { source, setSource, activeCollapsible, toggleCollapsible } = useImportStore();

    return (
        <Collapsible
            label="Import from"
            currCollapsible={activeCollapsible}
            setCurrCollapsible={() => toggleCollapsible('source')}
            selected={source === 'chess.com' ? 'Chess.com' :
                source === 'lichess' ? 'Lichess.org' : ''}
            innerJSX={
                <div className="flex flex-col text-slate-50 py-4 gap-2">
                    <label className="flex gap-2 items-center">
                        <input
                            type="radio"
                            value="chess.com"
                            checked={source === 'chess.com'}
                            onChange={(e) => setSource(e.target.checked ? 'chess.com' : null)}
                        />
                        Chess.com
                    </label>
                    <label className="flex gap-2 items-center">
                        <input
                            type="radio"
                            value="lichess"
                            checked={source === 'lichess'}
                            onChange={(e) => setSource(e.target.checked ? 'lichess' : null)}
                        />
                        Lichess.org
                    </label>
                </div>
            }
        />
    );
}