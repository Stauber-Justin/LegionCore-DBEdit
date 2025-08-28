import { Effect, ImplicitTarget, Attributes1 } from "./enums";
import type { SpellForm } from "./schema";

function q(s: string | undefined) { return s ? `'${s.replace(/'/g, "''")}'` : "NULL"; }
function bitmask(keys: (keyof typeof Attributes1)[] | undefined) {
  return (keys ?? []).reduce((m, k) => m | Attributes1[k], 0);
}

export function buildSqlBundle(f: SpellForm) {
  const id = f.ID;
  const name = q(f.Name);
  const desc = q(f.Description);
  const attr1 = bitmask(f.Attr1);

  const hotfix: string[] = [];
  hotfix.push("-- HOTFIXES: spell");
  hotfix.push(`REPLACE INTO \`spell\` (ID, Name, Description, VerifiedBuild) VALUES (${id}, ${name}, ${desc}, 0);`);

  hotfix.push("-- HOTFIXES: spell_misc (Attr1 minimal)");
  hotfix.push(`REPLACE INTO \`spell_misc\` (ID, Attributes1, VerifiedBuild) VALUES (${id}, ${attr1}, 0);`);

  if (f.Effect0) {
    const eff = Effect[f.Effect0];
    const bp = f.BasePoints0 ?? 0;
    const tgt = f.Target0 ? ImplicitTarget[f.Target0] : 0;
    hotfix.push("-- HOTFIXES: spell_effect idx0");
    hotfix.push(
      "REPLACE INTO `spell_effect` " +
      "(ID, EffectIndex, Effect, EffectBasePoints, ImplicitTarget1, SpellID, VerifiedBuild) VALUES " +
      `(${id * 10 + 0}, 0, ${eff}, ${bp}, ${tgt}, ${id}, 0);`
    );
  }

  const world: string[] = [];
  world.push("-- WORLD: (hier später z.B. spell_script_names)");

  return { hotfixSql: hotfix.join("\n") + "\n", worldSql: world.join("\n") + "\n" };
}
