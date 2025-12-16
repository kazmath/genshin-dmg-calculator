import { ArtifactSet, Character, Weapon } from "./CharacterTypes";
import { RangeNum } from "./HelperTypes";
import { ElementName } from "./OtherTypes";

export * from "./CharacterTypes";
export * from "./HakushinTypes";
export * from "./HelperTypes";
export * from "./OtherTypes";

export type Enemy = {
    level: RangeNum<1, 121>;
    res: number;
    resAnemo: number;
    resCryo: number;
    resDendro: number;
    resElectro: number;
    resGeo: number;
    resHydro: number;
    resPyro: number;
    resPhysical: number;
};

export interface CharacterStats extends Stats {
    character: Character;
    weapon: Weapon;
    artifacts: {
        sets: ArtifactSet[];
        mainStats: {
            sands:
                | "HP"
                | "ATK"
                | "DEF"
                | "EM" //
                | "ER";
            goblet:
                | "HP"
                | "ATK"
                | "DEF"
                | "EM"
                | "DMG" //
                | "Phys";
            circlet:
                | "HP"
                | "ATK"
                | "DEF"
                | "EM"
                | "CRIT Rate"
                | "CRIT DMG" //
                | "Healing Bonus";
        };
        subStats: {
            HP_: RangeNum<0, 46>;
            HP: RangeNum<0, 46>;
            ATK_: RangeNum<0, 46>;
            ATK: RangeNum<0, 46>;
            DEF_: RangeNum<0, 46>;
            DEF: RangeNum<0, 46>;
            EM: RangeNum<0, 46>;
            CRITRate: RangeNum<0, 46>;
            CRITDMG: RangeNum<0, 46>;
            ER: RangeNum<0, 46>;
        };
    };
}

export type Stats = {
    HP: number;
    ATK: number;
    DEF: number;
    EM: number;
    CritRate: number;
    CritDMG: number;
    ER: number;
    HealingBonus: number;
    DMGBonus: { [element in ElementName | "Physical"]: number };
    RESShred: { [element in ElementName | "Physical"]: number };
};
