import React from 'react';
import {AnalysisSettingsMenu} from "./AnalysisSettingsMenu";

export function AnalysisSettingsButton({ isAnalysisOn, handleMultiPVChange, handleGoalDepthChange, disabled, goalSearchDepth, multiPV }) {
    const [showSettings, setShowSettings] = React.useState(false);
    const settingsRef = React.useRef(null);
    const buttonRef = React.useRef(null);

    // Close settings menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowSettings(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Engine Settings"
                disabled={disabled}
                className="rounded-full fill-slate-400 h-8 w-8 hover:rotate-45 hover:fill-slate-300 transition-all p-1 touch-manipulation outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="M433-80q-27 0-46.5-18T363-142l-9-66q-13-5-24.5-12T307-235l-62 26q-25 11-50 2t-39-32l-47-82q-14-23-8-49t27-43l53-40q-1-7-1-13.5v-27q0-6.5 1-13.5l-53-40q-21-17-27-43t8-49l47-82q14-23 39-32t50 2l62 26q11-8 23-15t24-12l9-66q4-26 23.5-44t46.5-18h94q27 0 46.5 18t23.5 44l9 66q13 5 24.5 12t22.5 15l62-26q25-11 50-2t39 32l47 82q14 23 8 49t-27 43l-53 40q1 7 1 13.5v27q0 6.5-2 13.5l53 40q21 17 27 43t-8 49l-48 82q-14 23-39 32t-50-2l-60-26q-11 8-23 15t-24 12l-9 66q-4 26-23.5 44T527-80h-94Zm49-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z"/>
                </svg>
            </button>

            <AnalysisSettingsMenu
                settingsRef={settingsRef}
                showSettings={showSettings}
                isAnalysisOn={isAnalysisOn}
                handleMultiPVChange={handleMultiPVChange}
                handleGoalDepthChange={handleGoalDepthChange}
                goalSearchDepth={goalSearchDepth}
                multiPV={multiPV}
            />
        </div>
    );
}