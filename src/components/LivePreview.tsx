"use client";
import { buildSqlBundle } from "@/lib/sqlgen";
import type { SpellForm } from "@/lib/formStore";

export function LivePreview({ form }: { form: SpellForm }) {
  const { hotfixSql, worldSql } = buildSqlBundle(form);
  return (
    <details className="border rounded p-3">
      <summary className="cursor-pointer font-semibold">Preview SQL</summary>
      <div className="grid gap-3 mt-2">
        <div>
          <div className="font-mono text-sm opacity-70 mb-1">Hotfixes.sql</div>
          <pre className="overflow-auto text-sm border p-2">{hotfixSql}</pre>
        </div>
        <div>
          <div className="font-mono text-sm opacity-70 mb-1">World.sql</div>
          <pre className="overflow-auto text-sm border p-2">{worldSql}</pre>
        </div>
      </div>
    </details>
  );
}
