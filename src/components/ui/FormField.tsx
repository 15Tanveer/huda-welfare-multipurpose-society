import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-brand-ink">
        {label}
        {required ? (
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-brand-muted">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const fieldClasses =
  "w-full rounded-lg border border-brand-ink/15 bg-white px-3.5 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted/70 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60";

export const inputClasses = fieldClasses;
