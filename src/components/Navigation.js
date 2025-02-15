export function Navigation({ onMenuClick }) {
    return (
        <nav className="flex items-center p-2 gap-2 text-sm text-slate-50">
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 hover:bg-slate-600 rounded-full"
                aria-label="Open menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            <span className="flex flex-1 text-lg lg:text-base">eval.bar</span>
            <ul className="flex flex-1 justify-end gap-4">
                <li className="hover:text-slate-300 cursor-pointer">About</li>
                <li className="hover:text-slate-300 cursor-pointer">Donate</li>
            </ul>
        </nav>
    );
}