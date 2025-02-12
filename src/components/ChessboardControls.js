export function ChessboardControls({
                                       previousMove,
                                       nextMove,
                                       orientedWhite,
                                       setOrientedWhite
                                   }) {
    return (
        // ChessboardControls.jsx
        <div className="flex flex-1 gap-2 pt-2">
            <div className="flex flex-1 justify-start">
                <button className="rounded-full fill-slate-400 hover:fill-slate-300 transition duration-100">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 -960 960 960">
                        <path d="M433-80q-27 0-46.5-18T363-142l-9-66q-13-5-24.5-12T307-235l-62 26q-25 11-50 2t-39-32l-47-82q-14-23-8-49t27-43l53-40q-1-7-1-13.5v-27q0-6.5 1-13.5l-53-40q-21-17-27-43t8-49l47-82q14-23 39-32t50 2l62 26q11-8 23-15t24-12l9-66q4-26 23.5-44t46.5-18h94q27 0 46.5 18t23.5 44l9 66q13 5 24.5 12t22.5 15l62-26q25-11 50-2t39 32l47 82q14 23 8 49t-27 43l-53 40q1 7 1 13.5v27q0 6.5-2 13.5l53 40q21 17 27 43t-8 49l-48 82q-14 23-39 32t-50-2l-60-26q-11 8-23 15t-24 12l-9 66q-4 26-23.5 44T527-80h-94Zm49-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z"/>
                    </svg>
                </button>
            </div>
            <button onClick={previousMove} className="rotate-180 rounded-full hover:bg-slate-600 transition duration-100">
                <svg className="fill-slate-50" xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48">
                    <path d="m18.75 36-2.15-2.15 9.9-9.9-9.9-9.9 2.15-2.15L30.8 23.95Z"/>
                </svg>
            </button>
            <button onClick={nextMove} className="rounded-full hover:bg-slate-600 transition duration-100">
                <svg className="fill-slate-50" xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48">
                    <path d="m18.75 36-2.15-2.15 9.9-9.9-9.9-9.9 2.15-2.15L30.8 23.95Z"/>
                </svg>
            </button>
            <div className="flex flex-1 justify-end">
                <button
                    onClick={() => setOrientedWhite(!orientedWhite)}
                    className="rounded-full fill-slate-400 hover:fill-slate-300 transition duration-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 -960 960 960">
                        <path d="M240-478q0 45 17 87.5t53 78.5l10 10v-58q0-17 11.5-28.5T360-400q17 0 28.5 11.5T400-360v160q0 17-11.5 28.5T360-160H200q-17 0-28.5-11.5T160-200q0-17 11.5-28.5T200-240h70l-16-14q-52-46-73-105t-21-119q0-94 48-170.5T337-766q14-8 29.5-1t20.5 23q5 15-.5 30T367-691q-58 32-92.5 88.5T240-478Zm480-4q0-45-17-87.5T650-648l-10-10v58q0 17-11.5 28.5T600-560q-17 0-28.5-11.5T560-600v-160q0-17 11.5-28.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720h-70l16 14q49 49 71.5 106.5T800-482q0 94-48 170.5T623-194q-14 8-29.5 1T573-216q-5-15 .5-30t19.5-23q58-32 92.5-88.5T720-482Z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}