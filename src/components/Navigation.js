import React from "react";

export function Navigation() {
    const [showAbout, setShowAbout] = React.useState(false);

    return (
        <>
            <nav className="flex items-center p-2 justify-between text-sm text-slate-50">
                <a
                    href="/"
                    className="flex text-xl lg:text-base hover:text-slate-300 transition-colors"
                >
                    eval.bar
                </a>

                <ul className="flex justify-end items-center gap-6">
                    <li>
                        <a
                            href="https://github.com/goodvibs/eval.bar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-slate-300 transition-colors flex items-center gap-1.5"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span className="hidden sm:inline">GitHub</span>
                        </a>
                    </li>
                    <li>
                        <button
                            onClick={() => setShowAbout(true)}
                            className="hover:text-slate-300 transition-colors flex items-center gap-1.5"
                        >
                            <svg fill="currentColor" height="16" width="16" viewBox="0 -960 960 960">
                                <path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                            </svg>
                            <span className="hidden sm:inline">About</span>
                        </button>
                    </li>
                    <li>
                        <a
                            href="https://github.com/sponsors/goodvibs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-slate-300 transition-colors flex items-center gap-1.5"
                        >
                            <svg height="14" viewBox="0 0 16 16" width="14" fill="currentColor">
                                <path fillRule="evenodd" d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25z"/>
                            </svg>
                            <span className="hidden sm:inline">Donate</span>
                        </a>
                    </li>
                </ul>
            </nav>

            {/* About Dialog */}
            <div
                className={`
                    fixed inset-0 z-50
                    transition-all duration-300
                    ${showAbout ? 'bg-slate-900 bg-opacity-50 pointer-events-auto backdrop-blur' : 'bg-opacity-0 pointer-events-none'}
                    flex items-center justify-center
                `}
                onClick={(e) => {
                    if (e.target === e.currentTarget) setShowAbout(false);
                }}
            >
                <div
                    className={`
                        bg-slate-700 p-6 rounded-lg max-w-md w-full mx-4
                        transition-all duration-300
                        ${showAbout ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                    `}
                >
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg font-semibold text-slate-50">About eval.bar</h2>
                        <div className="flex items-center justify-end">
                            <button
                                onClick={() => setShowAbout(false)}
                                className="p-2 hover:bg-slate-600 rounded-full"
                                aria-label="Close menu"
                            >
                                <svg
                                    className="w-4 h-4 text-slate-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="text-slate-300 gap-2 space-y-4">
                        <p>
                            eval.bar is an open-source chess analysis tool that helps you analyze your games
                            using Stockfish.
                        </p>
                        <p>
                            This is still under development, so expect some bugs and missing features. Feel free to make a pull request or open an issue on GitHub!
                        </p>
                        <p>
                            - Vib
                        </p>
                        <div className="flex gap-2 justify-between text-sm text-slate-400 pt-4 border-t border-slate-600">
                            <a
                                href="https://github.com/goodvibs/eval.bar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                View source code
                            </a>
                            <span>Version 0.1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}