export type WeaponType =
    | "WEAPON_SWORD_ONE_HAND" // Sword
    | "WEAPON_CLAYMORE" // Claymore
    | "WEAPON_POLE" // Polearm
    | "WEAPON_CATALYST" // Catalyst
    | "WEAPON_BOW"; // Bow

export type ElementName =
    | "Anemo"
    | "Cryo"
    | "Dendro"
    | "Electro"
    | "Geo"
    | "Hydro"
    | "Pyro";

export type AttributeName =
    | "HP_PERCENT" // HP%
    | "ATTACK_PERCENT" // ATK%
    | "DEFENSE_PERCENT" // DEF%
    | "ELEMENT_MASTERY" // EM
    | "CHARGE_EFFICIENCY" // ER%
    | "CRITICAL" // Crit Rate
    | "CRITICAL_HURT" // Crit DMG
    | "HEAL_ADD" // Healing Bonus
    | "WIND_ADD_HURT" // Anemo DMG Bonus
    | "ICE_ADD_HURT" // Cryo DMG Bonus
    | "GRASS_ADD_HURT" // Dendro DMG Bonus
    | "ELEC_ADD_HURT" // Electro DMG Bonus
    | "ROCK_ADD_HURT" // Geo DMG Bonus
    | "WATER_ADD_HURT" // Hydro DMG Bonus
    | "PHYSICAL_ADD_HURT" // Physical DMG Bonus
    | "FIRE_ADD_HURT"; // Pyro DMG Bonus
