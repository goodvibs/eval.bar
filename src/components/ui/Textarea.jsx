const baseStyles =
    'p-2 bg-slate-800 rounded-lg border border-slate-600 text-slate-200 outline-none font-mono min-h-48 transition-colors focus:border-slate-500';

export function Textarea({ className = '', ...props }) {
    return <textarea className={`${baseStyles} ${className}`.trim()} {...props} />;
}
