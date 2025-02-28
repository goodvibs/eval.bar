import React from "react";
import {GitHubButton} from "./GitHubButton";
import {AboutButton} from "./AboutButton";
import {DonateButton} from "./DonateButton";
import {AboutDialog} from "./AboutDialog";

export function NavigationBar() {
    const [showAbout, setShowAbout] = React.useState(false);

    return (
        <>
            <nav className="flex items-center py-2 px-4 justify-between text-sm text-slate-100">
                <a
                    href="/"
                    className="flex text-xl lg:text-base hover:text-slate-300"
                >
                    eval.bar
                </a>

                <ul className="flex justify-end items-center gap-5">
                    <li>
                        <AboutButton setShowAbout={setShowAbout} />
                    </li>
                    <li>
                        <GitHubButton />
                    </li>
                    <li>
                        <DonateButton />
                    </li>
                </ul>
            </nav>

            <AboutDialog showAbout={showAbout} setShowAbout={setShowAbout} />
        </>
    );
}