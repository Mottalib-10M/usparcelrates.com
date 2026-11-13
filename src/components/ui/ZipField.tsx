/** A ZIP Code field: digits only, kept exactly as typed (check-saisie), five digits read. */
import { type ChangeEvent } from 'react';

interface Props { id: string; label: string; value: string; onChange: (v: string) => void; help?: string; className?: string }

export default function ZipField({ id, label, value, onChange, help, className = '' }: Props) {
  const change = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value.replace(/\D/g, '').slice(0, 5));
  const short = value.length > 0 && value.length < 5;
  return (
    <div className={`grid grid-rows-subgrid row-span-3 content-start gap-y-0 ${className}`}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="text" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={value} onChange={change} placeholder="5 digits" aria-describedby={help || short ? `${id}-help` : undefined}
        className="tabular-nums h-12 w-full self-start rounded-lg border border-navy-300 bg-white px-4 text-lg tracking-wider text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      {short
        ? <p id={`${id}-help`} role="status" className="mt-1 text-xs font-medium text-amber-700">Five digits, for example 10001</p>
        : help && <p id={`${id}-help`} className="mt-1 text-xs text-navy-500">{help}</p>}
    </div>
  );
}
