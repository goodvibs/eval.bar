import React, { useState, useEffect } from "react";
import { detectBrowser, getExtensionStoreUrl } from "../utils/browserDetection";

export function ExtensionPrompt({ hidden, close }) {
    const [browser, setBrowser] = useState("other");

    useEffect(() => {
        setBrowser(detectBrowser());
    }, []);

    const extensionUrl = getExtensionStoreUrl(browser);

    // Browser-specific installation instructions
    const getInstructions = () => {
        switch(browser) {
            case "safari":
                return (
                    <div className="mt-3 text-slate-300 text-sm space-y-2">
                        <p>For Safari, after installation:</p>
                        <ol className="list-decimal pl-5">
                            <li>Open Safari Preferences</li>
                            <li>Go to Extensions tab</li>
                            <li>Enable the Chess Analyzer extension</li>
                            <li>Allow access to Chess.com when prompted</li>
                        </ol>
                    </div>
                );
            case "firefox":
                return (
                    <div className="mt-3 text-slate-300 text-sm space-y-2">
                        <p>For Firefox, you may need to:</p>
                        <ol className="list-decimal pl-5">
                            <li>Click "Allow" when prompted to install</li>
                            <li>Reload the Chess.com page after installation</li>
                        </ol>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center 
                transition-all duration-300 ease-in-out
                ${hidden ? "bg-opacity-0 pointer-events-none" : "bg-opacity-50 backdrop-blur pointer-events-auto"}
                bg-slate-100
            `}
        >
            <div
                className={`
                    bg-slate-800 p-6 rounded-lg shadow-xl max-w-md 
                    transition-all duration-300 ease-in-out
                    ${hidden ? "opacity-0 translate-y-8 scale-95" : "opacity-100 translate-y-0 scale-100"}
                `}
            >
                <h2 className="text-xl font-bold text-slate-100 mb-4">Extension Required</h2>
                <p className="mb-4 text-slate-200">
                    To import games directly from Chess.com, you'll need the eval.bar browser extension.
                    {browser !== "other" && (
                        <span> Looks like you're using <span className="font-medium capitalize">{browser}</span>.</span>
                    )}
                </p>

                {browser === "other" ? (
                    <div className="mb-4 text-amber-300 text-sm">
                        eval.bar doesn't have a specific extension for your browser. Try using Chrome, Firefox, Safari, or Edge.
                    </div>
                ) : null}

                <p className="mb-3 text-slate-300 text-sm">
                    This extension only accesses Chess.com game data when you request it and doesn't collect any personal information.
                </p>

                {getInstructions()}

                <div className="flex gap-3 mt-6">
                    <a
                        href={extensionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 
                            text-white px-4 py-2 rounded transition-colors flex-1 text-center
                            ${browser === "other" ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                        onClick={e => browser === "other" && e.preventDefault()}
                    >
                        Install Extension
                    </a>
                    <button
                        onClick={close}
                        className="bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-200 px-4 py-2 rounded transition-colors"
                    >
                        Use Alternatives
                    </button>
                </div>
            </div>
        </div>
    );
}