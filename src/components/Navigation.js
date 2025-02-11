export function Navigation() {
    return (
        <nav className="flex p-2 text-sm text-slate-50">
            <span className="flex flex-1">eval.bar</span>
            <span className="flex flex-1"></span>
            <ul className="flex flex-1 justify-end gap-4">
                <li>About</li>
                <li>Support</li>
            </ul>
        </nav>
    );
}