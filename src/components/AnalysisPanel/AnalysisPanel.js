import {AnalysisHeader} from "./AnalysisHeader";
import {AnalysisLine} from "./AnalysisLine";
import {useGameStore} from "../../stores/gameStore";

export function AnalysisPanel() {
    const { analysis, currentFen } = useGameStore();

    // Mock data for now - this would come from Stockfish
    const analysisLines = [
        {
            evaluation: 0.8,
            depth: 20,
            moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6"],
            isMainLine: true
        },
        {
            evaluation: 0.5,
            depth: 20,
            moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"],
            isMainLine: false
        },
        {
            evaluation: 0.3,
            depth: 20,
            moves: ["c4", "e5", "Nc3", "Nf6", "Nf3", "Nc6"],
            isMainLine: false
        }
    ];

    return (
        <div className="flex flex-col flex-1 bg-slate-800 rounded-lg overflow-hidden">
            <AnalysisHeader
                depth={analysis.depth}
                isAnalyzing={analysis.isAnalyzing}
            />

            <div className="flex flex-col divide-y divide-slate-700">
                {analysisLines.map((line, idx) => (
                    <AnalysisLine
                        key={idx}
                        evaluation={line.evaluation}
                        depth={line.depth}
                        moves={line.moves}
                        isMainLine={line.isMainLine}
                    />
                ))}
            </div>

            <div className="mt-4 p-2 text-xs text-slate-500">
                <div>FEN: {currentFen}</div>
            </div>
        </div>
    );
}