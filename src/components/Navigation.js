export function Navigation({ onMenuClick }) {
    return (
        <nav className="flex items-center p-2 justify-between text-sm text-slate-50">
            <span className="flex text-lg lg:text-base">eval.bar</span>
            <ul className="flex justify-end gap-4">
                <li className="hover:text-slate-300 cursor-pointer">About</li>
                <li className="hover:text-slate-300 cursor-pointer">Donate</li>
            </ul>
        </nav>
    );
}