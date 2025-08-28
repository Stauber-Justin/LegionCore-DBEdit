import type { SpellForm } from "./formStore";
import {
  Attributes1,
  type Attributes1Key,
  Effect,
  type EffectKey,
  ImplicitTarget,
  type ImplicitTargetKey,
} from "./enums";

function unquote(s: string) {
  const t = s.trim();
  if (t.startsWith("'") && t.endsWith("'"))
    return t.slice(1, -1).replace(/''/g, "'");
  if (t.toUpperCase() === "NULL") return undefined;
  return t;
}

function splitCsvRespectingQuotes(s: string): string[] {
  const out: string[] = [];
  let cur = "",
    inQ = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'" && s[i - 1] !== "\\") inQ = !inQ;
    if (c === "," && !inQ) {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  if (cur) out.push(cur.trim());
  return out;
}

function parseInsert(line: string) {
  const m = line.match(
    /^(REPLACE|INSERT)\s+INTO\s+`?(\w+)`?\s*\(([^)]+)\)\s*VALUES\s*\((.+)\)\s*;?$/i
  );
  if (!m) return null;
  const table = m[2].toLowerCase();
  const columns = m[3].split(",").map((c) => c.trim().replace(/`/g, ""));
  const values = splitCsvRespectingQuotes(m[4]).map((v) => v.trim());
  if (columns.length !== values.length) return null;
  return { table, columns, values };
}

function toEffectKey(val: number): EffectKey | undefined {
  if (val === Effect.APPLY_AURA) return "APPLY_AURA";
  if (val === Effect.ATTACK_ME) return "ATTACK_ME";
  return undefined;
}

function toTargetKey(val: number): ImplicitTargetKey | undefined {
  if (val === ImplicitTarget.UNIT_CASTER) return "UNIT_CASTER";
  if (val === ImplicitTarget.SRC_AREA_ENEMY) return "SRC_AREA_ENEMY";
  return undefined;
}

export function parseSqlToForm(sqlText: string): Partial<SpellForm> {
  const form: Partial<SpellForm> = {};
  const lines = sqlText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const p = parseInsert(line);
    if (!p) continue;

    if (p.table === "spell") {
      const idxID = p.columns.findIndex((c) => c.toLowerCase() === "id");
      const idxName = p.columns.findIndex((c) => c.toLowerCase() === "name");
      const idxDesc = p.columns.findIndex(
        (c) => c.toLowerCase() === "description"
      );
      if (idxID >= 0) form.ID = Number(unquote(p.values[idxID]));
      if (idxName >= 0) form.Name = String(unquote(p.values[idxName]) ?? "");
      if (idxDesc >= 0)
        form.Description = String(unquote(p.values[idxDesc]) ?? "");
    }

    if (p.table === "spell_misc") {
      const a1Idx = p.columns.findIndex(
        (c) => c.toLowerCase() === "attributes1"
      );
      if (a1Idx >= 0) {
        const mask = Number(unquote(p.values[a1Idx]) ?? 0);
        const map: Record<number, Attributes1Key> = {
          0x20: "DISMISS_PET",
          0x200: "CAN_TARGET_DEAD",
        };
        const hits: Attributes1Key[] = [];
        for (const [hex, key] of Object.entries(map)) {
          const v = Number(hex);
          if ((mask & v) === v) hits.push(key);
        }
        if (hits.length) form.Attr1 = hits;
      }
    }

    if (p.table === "spell_effect") {
      const eIdx = p.columns.findIndex(
        (c) => c.toLowerCase() === "effectindex"
      );
      if (eIdx >= 0 && Number(unquote(p.values[eIdx])) !== 0) continue;

      const effIdx = p.columns.findIndex((c) => c.toLowerCase() === "effect");
      if (effIdx >= 0) {
        const val = Number(unquote(p.values[effIdx]));
        form.Effect0 = toEffectKey(val);
      }
      const bpIdx = p.columns.findIndex(
        (c) => c.toLowerCase() === "effectbasepoints"
      );
      if (bpIdx >= 0) form.BasePoints0 = Number(unquote(p.values[bpIdx]));

      const tgtIdx = p.columns.findIndex(
        (c) => c.toLowerCase() === "implicittarget1"
      );
      if (tgtIdx >= 0) {
        const t = Number(unquote(p.values[tgtIdx]));
        form.Target0 = toTargetKey(t);
      }
    }
  }
  return form;
}
