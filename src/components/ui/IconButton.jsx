export function IconButton({ icon, label, title, className = '', ...props }) {
    return (
        <button
            type="button"
            className={`p-1 rounded hover:bg-slate-600 text-slate-300 hover:text-slate-100 transition-colors ${className}`.trim()}
            aria-label={label}
            title={title ?? label}
            {...props}
        >
            {icon}
        </button>
    );
}
