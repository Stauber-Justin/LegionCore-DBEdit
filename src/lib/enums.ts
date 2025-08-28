export const Effect = {
  APPLY_AURA: 6,
  ATTACK_ME: 114,
} as const;
export type EffectKey = keyof typeof Effect;

export const ImplicitTarget = {
  UNIT_CASTER: 1,
  SRC_AREA_ENEMY: 15,
} as const;
export type ImplicitTargetKey = keyof typeof ImplicitTarget;

export const Attributes1 = {
  DISMISS_PET: 0x00000020,
  CAN_TARGET_DEAD: 0x00000200,
} as const;
export type Attributes1Key = keyof typeof Attributes1;
