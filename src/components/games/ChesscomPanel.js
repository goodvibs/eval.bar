import React from 'react';
import {useGameStore} from "../../stores/gameStore";
import {fetchChesscomGames} from "../../utils/chesscom";
import {Chessboard} from "react-chessboard";

export function ChesscomPanel() {
    // Get current date and format it as YYYY-MM
    const getCurrentYearMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const [username, setUsername] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(getCurrentYearMonth());
    const [games, setGames] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [hoveredGame, setHoveredGame] = React.useState(null);

    const { loadGame } = useGameStore();

    const handleFetchGames = async () => {
        if (!username || !selectedDate) return;

        setIsLoading(true);
        setError(null);

        try {
            const [year, month] = selectedDate.split('-');
            const fetchedGames = await fetchChesscomGames(username, year, month);
            let chronologicallyOrderedGames = fetchedGames.reverse();
            setGames(chronologicallyOrderedGames);
        } catch (error) {
            setError('Failed to fetch games. Please check the username and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGameSelect = (game) => {
        loadGame(game.pgn);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm lg:text-xs font-medium text-slate-300">
                    Chess.com Username
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="IMRosen"
                    className="p-2 bg-slate-800 outline-none rounded text-slate-200 border border-slate-600"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm lg:text-xs font-medium text-slate-300">
                    Select Month
                </label>
                <input
                    type="month"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-2 bg-slate-800 rounded outline-none text-slate-200 border border-slate-600"
                    placeholder='YYYY-MM'
                />
            </div>

            <button
                onClick={handleFetchGames}
                disabled={!selectedDate || isLoading}
                className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:hover:bg-emerald-600"
            >
                {isLoading ? 'Loading...' : 'Fetch Games'}
            </button>

            {error && (
                <div className="text-red-400 text-sm">
                    {error}
                </div>
            )}

            {games.length > 0 && (
                <div className="relative flex gap-4">
                    <div className="flex bg-slate-800 p-2 border rounded-lg border-slate-600 flex-1 flex-col gap-2 max-h-72 overflow-y-auto
            scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-slate-600
            active:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                        {games.map((game) => (
                            <button
                                key={game.id}
                                onClick={() => handleGameSelect(game)}
                                onMouseEnter={() => setHoveredGame(game)}
                                onMouseLeave={() => setHoveredGame(null)}
                                disabled={!game.isSupported}
                                className={`
                                    text-left p-3 rounded bg-slate-800
                                    ${game.isSupported
                                    ? 'hover:bg-slate-600'
                                    : ''}
                                    transition-colors relative group
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <div className="flex flex-wrap items-center text-sm font-medium">
                                            {game.white}
                                            <span className="text-xs ml-0.5">({game.whiteElo})</span>
                                            <span className="text-slate-400 mx-1 font-normal">vs</span>
                                            {game.black}
                                            <span className="text-xs ml-0.5">({game.blackElo})</span>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {game.date.toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className={`
                                        px-2 py-1 rounded text-xs text-nowrap
                                        ${game.result === '1-0' ? 'bg-green-900 text-green-100' :
                                        game.result === '0-1' ? 'bg-red-900 text-red-100' :
                                            'bg-slate-600 text-slate-200'}
                                    `}>
                                        {game.result}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {game.timeControl}
                                    </span>
                                    {!game.isSupported && (
                                        <span className="text-yellow-500">
                                            {game.variant || 'Unsupported variant'}
                                        </span>
                                    )}
                                    {game.eco && (
                                        <span title={game.opening}>
                                            {game.eco}
                                            {game.opening && `: ${game.opening.length > 30
                                                ? game.opening.slice(0, 30) + '...'
                                                : game.opening}`}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/*{hoveredGame && (*/}
                    {/*    <div*/}
                    {/*        className="fixed w-64 bg-slate-800 z-50 rounded-lg shadow-lg p-4 border border-slate-600"*/}
                    {/*        style={{*/}
                    {/*            // Position it next to the games list*/}
                    {/*            left: 'min(100vw - 280px, var(--popup-left))',*/}
                    {/*            top: 'var(--popup-top)',*/}
                    {/*            transform: 'translateY(-50%)'*/}
                    {/*        }}*/}
                    {/*        ref={el => {*/}
                    {/*            if (el) {*/}
                    {/*                // Get the bounding rect of the hovered button*/}
                    {/*                const button = el.parentElement.querySelector(':hover');*/}
                    {/*                if (button) {*/}
                    {/*                    const rect = button.getBoundingClientRect();*/}
                    {/*                    el.style.setProperty('--popup-left', `${rect.right + 16}px`);*/}
                    {/*                    el.style.setProperty('--popup-top', `${rect.top + rect.height/2}px`);*/}
                    {/*                }*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <Chessboard*/}
                    {/*            position={hoveredGame.finalPosition}*/}
                    {/*            boardWidth={256}*/}
                    {/*            isDraggable={false}*/}
                    {/*            customLightSquareStyle={{backgroundColor: "#cbd5e1"}}*/}
                    {/*            customDarkSquareStyle={{backgroundColor: "#64748b"}}*/}
                    {/*        />*/}
                    {/*        {hoveredGame.opening && (*/}
                    {/*            <div className="mt-2 text-sm text-slate-300">*/}
                    {/*                <div className="font-medium">{hoveredGame.eco}</div>*/}
                    {/*                <div className="text-slate-400">{hoveredGame.opening}</div>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            )}
        </div>
    );
}