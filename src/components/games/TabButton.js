export function TabButton({ active, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                border-t border-x border-transparent
                hover:border-slate-600 rounded-t p-2
                ${active ? 'bg-slate-600 text-white' : 'text-slate-300'}
                text-sm font-medium
            `}
        >
            {label}
        </button>
    );
}