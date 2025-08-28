import type { Attributes1Key, EffectKey, ImplicitTargetKey } from "./enums";

export type SpellForm = {
  ID: number;
  Name: string;
  Description?: string;
  Effect0?: EffectKey;
  BasePoints0?: number;
  Target0?: ImplicitTargetKey;
  Attr1?: Attributes1Key[];
};

type Action =
  | { type: "set"; key: keyof SpellForm; value: SpellForm[keyof SpellForm] }
  | { type: "toggle-flag"; key: "Attr1"; flag: Attributes1Key }
  | { type: "load"; value: Partial<SpellForm> }
  | { type: "reset" };

export function reducer(state: SpellForm, a: Action): SpellForm {
  switch (a.type) {
    case "set":
      return { ...state, [a.key]: a.value } as SpellForm;
    case "toggle-flag": {
      const cur = new Set(state.Attr1 ?? []);
      if (cur.has(a.flag)) cur.delete(a.flag);
      else cur.add(a.flag);
      return { ...state, Attr1: Array.from(cur) };
    }
    case "load":
      return { ...state, ...a.value };
    case "reset":
      return { ID: 0, Name: "" };
  }
}

export const initialForm: SpellForm = {
  // ⬅️ WICHTIG: benannter Export
  ID: 4010420,
  Name: "Shout",
};
