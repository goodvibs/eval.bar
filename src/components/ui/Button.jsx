export function Button({ variant = 'primary', icon, children, className = '', disabled, type = 'button', ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 rounded-lg transition-colors font-medium';
    const variants = {
        primary:
            'bg-emerald-600 hover:bg-emerald-500 text-slate-100 font-semibold py-2 px-4 disabled:opacity-50 disabled:hover:bg-emerald-600',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4',
        ghost: 'text-slate-300 hover:text-slate-100 p-1 rounded hover:bg-slate-600',
    };
    const classes = `${base} ${variants[variant] || variants.primary} ${className}`.trim();

    return (
        <button type={type} className={classes} disabled={disabled} {...props}>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
}
