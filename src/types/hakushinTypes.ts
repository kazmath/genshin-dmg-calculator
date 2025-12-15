import { RangeNum } from "./helperTypes";
import { AttributeName, ElementName, WeaponType } from "./otherTypes";

type HakushinRank = "QUALITY_PURPLE" | "QUALITY_ORANGE";

export type HakushinTalent = {
    Id: unknown;
    Name: string;
    Desc: string;
    Promote: {
        [key: `${number}`]: {
            Level: RangeNum<1, 16>;
            Icon: unknown;
            Desc: string[];
            Param: number[];
        };
    };
};

type HakushinPassive = {
    Id: unknown;
    Name: string;
    Desc: string;
    Icon: unknown;
    Unlock: 1 | 4 | 0;
    ParamList: number[];
};

type HakushinConstellation = {
    Id: unknown;
    Name: string;
    Desc: string;
    Icon: unknown;
    ParamList: number[];
};

export type HakushinCharacter = {
    Name: string;
    Weapon: WeaponType;
    Rarity: HakushinRank;
    Element: ElementName;
    BaseHP: number;
    BaseATK: number;
    BaseDEF: number;
    CritRate: number;
    CritDMG: number;
    ElementalMastery: number;
    LevelEXP: unknown;
    StatsModifier: {
        HP: { string: number };
        ATK: { string: number };
        DEF: { string: number };
        Ascension: Array<{
            [key in `FIGHT_PROP_${AttributeName}`]: number;
        }>;
        PropGrowCurves: unknown;
    };
    Skills: HakushinTalent[];
    Passives: HakushinPassive[];
    Constellations: HakushinConstellation[];
    Materials: unknown;
};
