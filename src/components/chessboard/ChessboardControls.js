import {ChessboardSettingsButton} from "./ChessboardSettingsButton";
import {ChessboardFlipOrientationButton} from "./ChessboardFlipOrientationButton";

export function ChessboardControls({
                                       firstMove,
                                       previousMove,
                                       nextMove,
                                       lastMove,
                                       orientedWhite,
                                       setOrientedWhite
                                   }) {
    return (
        <div className="flex flex-1 gap-2">
            <div className="flex flex-1 justify-start p-2">
                <ChessboardSettingsButton/>
            </div>
            <button onClick={firstMove} className="rotate-180 rounded-full bg-slate-600 hover:bg-slate-500 transition duration-100">
                <svg className="fill-slate-300" xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 -960 960 960">
                    <path d="M421.85-480 258.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.9 2.31 6.28 2.31 13.46 0 7.18-2.31 13.41t-7.92 11.85L301.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L421.85-480Zm258.16-230q12.76 0 21.37 8.63Q710-692.75 710-680v400q0 12.75-8.63 21.37-8.63 8.63-21.38 8.63-12.76 0-21.37-8.63Q650-267.25 650-280v-400q0-12.75 8.63-21.37 8.63-8.63 21.38-8.63Z"/>
                </svg>
            </button>
            <button onClick={previousMove} className="rotate-180 rounded-full bg-slate-600 hover:bg-slate-500 transition duration-100">
                <svg className="fill-slate-300" xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 -960 960 960">
                    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z"/>
                </svg>
            </button>
            <button onClick={nextMove} className="rounded-full bg-slate-600 hover:bg-slate-500 transition duration-100">
                <svg className="fill-slate-300" xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 -960 960 960">
                    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z"/>
                </svg>
            </button>
            <button onClick={lastMove} className="rounded-full bg-slate-600 hover:bg-slate-500 transition duration-100">
                <svg className="fill-slate-300" xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 -960 960 960">
                    <path d="M421.85-480 258.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.9 2.31 6.28 2.31 13.46 0 7.18-2.31 13.41t-7.92 11.85L301.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L421.85-480Zm258.16-230q12.76 0 21.37 8.63Q710-692.75 710-680v400q0 12.75-8.63 21.37-8.63 8.63-21.38 8.63-12.76 0-21.37-8.63Q650-267.25 650-280v-400q0-12.75 8.63-21.37 8.63-8.63 21.38-8.63Z"/>
                </svg>
            </button>

            <div className="flex flex-1 justify-end p-2">
                <ChessboardFlipOrientationButton orientedWhite={orientedWhite} setOrientedWhite={setOrientedWhite}/>
            </div>
        </div>
    );
}