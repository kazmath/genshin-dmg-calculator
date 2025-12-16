import { RangeNum } from "./HelperTypes";
import { AttributeName, ElementName, WeaponType } from "./OtherTypes";

export type Talent = {
    name: string;
    description: string;
    parameters: { [key: string]: string };
};
type Passive = {
    name: string;
    description: string;
    parameters?: number[];
};
type Constellation =
    | {
          name: string;
          description: string;
          upgradedTalent: Talent;
      }
    | {
          name: string;
          description: string;
          parameters?: number[];
      };

export type Character = {
    id: string;
    level: RangeNum<1, 91> | 95 | 100;
    name: string;
    rank: -1 | 4 | 5; // Special | 4-Star | 5-Star
    element: ElementName;
    baseHP: number;
    baseATK: number;
    baseDEF: number;
    ascStat: AttributeName;
    ascStatValue: number;
    normal: Talent;
    skill: Talent;
    burst: Talent;
    passiveA1: Passive;
    passiveA4: Passive;
    passiveUtil: Passive;
    passiveSpecial?: Passive;
    constellations: {
        "1": Constellation;
        "2": Constellation;
        "3": Constellation;
        "4": Constellation;
        "5": Constellation;
        "6": Constellation;
    };
};

export type Weapon = {
    id: string;
    level: RangeNum<1, 91>;
    rank: RangeNum<1, 6>;
    name: string;
    type: WeaponType;
    baseAtk: number;
    mainStat?: [AttributeName, number];
    passive: string;
};

export type ArtifactSet = {
    id: string;
    maxRank: string;
    name: string;
    passive2Piece: string;
    passive4Piece: string;
};
