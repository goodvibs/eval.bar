const baseStyles =
    'p-2 bg-slate-800 rounded-lg border border-slate-600 text-slate-200 outline-none transition-colors focus:border-slate-500';

export function Input({ className = '', ...props }) {
    return <input className={`${baseStyles} ${className}`.trim()} {...props} />;
}
