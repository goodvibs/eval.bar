export function ChessboardControls({
                                       previousMove,
                                       nextMove,
                                       orientedWhite,
                                       setOrientedWhite
                                   }) {
    return (
        <div className="flex flex-1 gap-2 p-2">
            <div className="flex flex-1 justify-start">
                <button className="rounded-full fill-slate-400 hover:fill-slate-300 transition duration-100">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                        <path d="M8.35 40v-3h6.5l-.75-.6q-3.2-2.55-4.65-5.55-1.45-3-1.45-6.7 0-5.3 3.125-9.525Q14.25 10.4 19.35 8.8v3.1q-3.75 1.45-6.05 4.825T11 24.15q0 3.15 1.175 5.475 1.175 2.325 3.175 4.025l1.5 1.05v-6.2h3V40Z"/>
                    </svg>
                </button>
            </div>
            <button onClick={previousMove} className="rotate-180 rounded-full hover:bg-slate-600 transition duration-100">
                <svg className="fill-slate-50" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                    <path d="m18.75 36-2.15-2.15 9.9-9.9-9.9-9.9 2.15-2.15L30.8 23.95Z"/>
                </svg>
            </button>
            <button onClick={nextMove} className="rounded-full hover:bg-slate-600 transition duration-100">
                <svg className="fill-slate-50" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                    <path d="m18.75 36-2.15-2.15 9.9-9.9-9.9-9.9 2.15-2.15L30.8 23.95Z"/>
                </svg>
            </button>
            <div className="flex flex-1 justify-end">
                <button
                    onClick={() => setOrientedWhite(!orientedWhite)}
                    className="rounded-full fill-slate-400 hover:fill-slate-300 transition duration-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                        <path d="M8.35 40v-3h6.5l-.75-.6q-3.2-2.55-4.65-5.55-1.45-3-1.45-6.7 0-5.3 3.125-9.525Q14.25 10.4 19.35 8.8v3.1q-3.75 1.45-6.05 4.825T11 24.15q0 3.15 1.175 5.475 1.175 2.325 3.175 4.025l1.5 1.05v-6.2h3V40Z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}