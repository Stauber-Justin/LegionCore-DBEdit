"use client";
import { useId } from "react";

export function FlagsField<K extends string>({
  label, options, value, onChange,
}: {
  label: string;
  options: Record<K, number>;
  value?: K[];
  onChange: (v: K[]) => void;
}) {
  const baseId = useId();
  const current = new Set(value ?? []);

  return (
    <fieldset className="border rounded p-3">
      <legend className="text-sm">{label}</legend>
      <div className="grid gap-1">
        {Object.entries(options).map(([k, v], i) => {
          const key = k as K;
          const num = v as number;
          const checked = current.has(key);
          const inputId = `${baseId}-${i}`;

          return (
            <div key={k} className="flex items-center gap-2">
              <input
                id={inputId}
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const next = new Set(current);
                  if (checked) next.delete(key);
                  else next.add(key);
                  onChange(Array.from(next));
                }}
              />
              <label htmlFor={inputId}>
                {k} (0x{num.toString(16).toUpperCase()})
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
