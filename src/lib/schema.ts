import type { EffectKey, ImplicitTargetKey, Attributes1Key } from "./enums";

export type SpellForm = {
  ID: number; Name: string; Description?: string;
  Effect0?: EffectKey; BasePoints0?: number; Target0?: ImplicitTargetKey;
  Attr1?: Attributes1Key[]; // Bitmask-Auswahl
};
