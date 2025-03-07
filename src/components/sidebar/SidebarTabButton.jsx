export function SidebarTabButton({ active, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                flex flex-1 items-center justify-center border-t border-x border-transparent
                hover:border-slate-600 rounded-t-3xl p-2
                ${active ? 'bg-slate-600 text-slate-100' : 'text-slate-300'}
                text-base lg:text-sm font-medium tracking-tighter
            `}
        >
            {label}
        </button>
    );
}