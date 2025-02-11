export function TabButton({ active, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
        border-t border-x border-transparent 
        hover:border-slate-600 rounded-t p-2 
        transition duration-100
        ${active ? "bg-slate-600" : ""}
      `}
        >
            {label}
        </button>
    );
}