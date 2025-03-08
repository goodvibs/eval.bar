import React from 'react';

export function LoadingOverlay({ message, error, onClose }) {
    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-90 z-50 flex items-center justify-center">
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md text-center">
                {error ? (
                    <>
                        <div className="text-red-500 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 mx-auto"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-100 mb-2">Import Failed</h2>
                        <p className="mb-4 text-slate-200">{error}</p>
                        <p className="text-sm text-slate-400 mb-6">
                            Make sure you're using a valid chess.com game URL and try again.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded transition-colors"
                        >
                            Close
                        </button>
                    </>
                ) : (
                    <>
                        <div className="mb-4">
                            <svg
                                className="animate-spin h-10 w-10 text-emerald-500 mx-auto"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </div>
                        <p className="text-lg text-slate-100">{message}</p>
                        <p className="text-sm text-slate-400 mt-2">This will just take a moment</p>
                    </>
                )}
            </div>
        </div>
    );
}
