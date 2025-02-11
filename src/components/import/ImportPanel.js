import {useImportStore} from "../../stores/importStore";
import {GameSelect} from "./GameSelect";
import {ImportSourceSelect} from "./ImportSourceSelect";
import {UsernameSelect} from "./UsernameSelect";

export function ImportPanel() {
    const { source, username, isLoading } = useImportStore();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col bg-slate-600 rounded overflow-hidden">
                <ImportSourceSelect />
                <UsernameSelect />
            </div>

            <GameSelect />

            {isLoading && (
                <div className="flex justify-center">
                    <span className="text-slate-300">Loading...</span>
                </div>
            )}
        </div>
    );
}