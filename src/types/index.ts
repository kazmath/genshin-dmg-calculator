import { RangeNum } from "./helperTypes";
import { AttributeName, ElementName } from "./otherTypes";

type Talent = {
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
    name: string;
    id: string;
    rank: 4 | 5;
    element: ElementName;
    base_hp: number;
    base_atk: number;
    base_def: number;
    asc_stat: AttributeName;
    asc_stat_value: number;
    normal: Talent;
    skill: Talent;
    burst: Talent;
    a1_passive: Passive;
    a4_passive: Passive;
    util_passive: Passive;
    special_passive?: Passive;
    constellations: {
        "1": Constellation;
        "2": Constellation;
        "3": Constellation;
        "4": Constellation;
        "5": Constellation;
        "6": Constellation;
    };
};

export type Enemy = {
    level: RangeNum<1, 111>;
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
