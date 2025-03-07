import React from "react";

export function AboutDialog({ showAbout, setShowAbout }) {
    return (
        <div
            className={`
                    fixed inset-0 z-50
                    transition-all duration-300
                    ${showAbout ? 'bg-slate-100 bg-opacity-50 pointer-events-auto backdrop-blur' : 'bg-opacity-0 pointer-events-none'}
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
                    <h2 className="text-lg font-semibold text-slate-100">About eval.bar</h2>
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
    )
}