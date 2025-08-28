"use client";
import { useReducer } from "react";
import { Effect, ImplicitTarget, Attributes1, type EffectKey, type ImplicitTargetKey, type Attributes1Key } from "@/lib/enums";
import { reducer, initialForm } from "@/lib/formStore";
import { FlagsField } from "@/components/FlagsField";
import { buildSqlBundle } from "@/lib/sqlgen";
import { LivePreview } from "@/components/LivePreview";
import { parseSqlToForm } from "@/lib/sqlparse";

export default function Page() {
  const [f, dispatch] = useReducer(reducer, initialForm);

  const save = (n: string, t: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([t], { type: "text/sql" }));
    a.download = n; a.click();
  };

  const exportSql = () => {
    const { hotfixSql, worldSql } = buildSqlBundle(f);
    save("Hotfixes_Spell.sql", hotfixSql);
    save("World_Spell.sql", worldSql);
  };

  const onImport = async (file: File) => {
    const text = await file.text();
    const patch = parseSqlToForm(text);
    dispatch({ type: "load", value: patch });
  };

  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-bold">Spell (MVP)</h1>

      <section className="grid gap-3">
        <label className="grid gap-1">
          <span>ID</span>
          <input className="border p-1" type="number" value={f.ID ?? 0}
                 onChange={e => dispatch({ type: "set", key: "ID", value: Number(e.target.value) })}/>
        </label>
        <label className="grid gap-1">
          <span>Name</span>
          <input className="border p-1" value={f.Name ?? ""}
                 onChange={e => dispatch({ type: "set", key: "Name", value: e.target.value })}/>
        </label>
        <label className="grid gap-1">
          <span>Effect[0]</span>
          <select className="border p-1" value={f.Effect0 ?? ""}
                  onChange={e => dispatch({ type: "set", key: "Effect0", value: e.target.value as EffectKey })}>
            <option value="" disabled>— wählen —</option>
            {Object.keys(Effect).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>
        <label className="grid gap-1">
          <span>BasePoints[0]</span>
          <input className="border p-1" type="number" value={f.BasePoints0 ?? 0}
                 onChange={e => dispatch({ type: "set", key: "BasePoints0", value: Number(e.target.value) })}/>
        </label>
        <label className="grid gap-1">
          <span>Target[0]</span>
          <select className="border p-1" value={f.Target0 ?? ""}
                  onChange={e => dispatch({ type: "set", key: "Target0", value: e.target.value as ImplicitTargetKey })}>
            <option value="" disabled>— wählen —</option>
            {Object.keys(ImplicitTarget).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>

        <FlagsField<Attributes1Key>
          label="Attributes1"
          options={Attributes1}
          value={f.Attr1}
          onChange={v => dispatch({ type: "set", key: "Attr1", value: v })}
        />
      </section>

      <div className="flex items-center gap-3">
        <button className="border rounded p-2" onClick={exportSql}>Export SQL</button>
        <label className="border rounded p-2 cursor-pointer">
          Import SQL
          <input type="file" accept=".sql,.txt" hidden onChange={e => {
            const file = e.currentTarget.files?.[0]; if (file) onImport(file);
          }}/>
        </label>
        <button className="border rounded p-2" onClick={() => dispatch({ type: "reset" })}>Reset</button>
      </div>

      <LivePreview form={f} />
    </main>
  );
}
