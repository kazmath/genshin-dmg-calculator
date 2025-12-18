import {
    AttributeName,
    Character,
    HakushinCharacter,
    RangeNum,
    Weapon,
} from "./types";
import { baseApiURL, normalize, takeUntil } from "./utils.js";

export async function fetchCharacter(
    characterId: string,
    options: {
        level: RangeNum<1, 91> | 95 | 100;
        talentLevels: [number, number, number];
        ascension?: number;
    } = {
        level: 90,
        talentLevels: [9, 9, 9],
    }
): Promise<Character> {
    const level = options.level;
    const talentLevels = options.talentLevels;
    const ascension =
        options.ascension ??
        (level > 20 ? 1 : 0) +
            (level > 40 ? 1 : 0) +
            (level > 50 ? 1 : 0) +
            (level > 60 ? 1 : 0) +
            (level > 70 ? 1 : 0) +
            (level > 80 ? 1 : 0);

    const regexTalentFromC3_C5 =
        /[^<>]*<color[^<>]*>(?:\{[^<>{}]*\})?([^<>{}]+)(?:\{[^<>{}]*\})?<\/color[^<>]*>.*/;
    const regexRemoveTalentLinks = /\{\/?[a-zA-Z][a-zA-Z0-9]*[^<>]*\}/g;

    return await fetch(`${baseApiURL}/data/en/character/${characterId}.json`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    })
        .then((e) => e.json())
        .then((e: HakushinCharacter) => {
            const [ascStat, ascStatValue] = Object.entries(
                e.StatsModifier.Ascension[ascension - 1]
            )
                .map<[string, number]>(([k, v]) => [
                    k.replace("FIGHT_PROP_", ""),
                    v,
                ])
                .find(([k, v]) => !k.startsWith("BASE"))!;

            const parametersNA = e.Skills[0].Promote[`${talentLevels[0] - 1}`];
            const parametersE = e.Skills[1].Promote[`${talentLevels[1] - 1}`];
            const parametersQ = e.Skills[2].Promote[`${talentLevels[2] - 1}`];
            const character: Character = {
                id: characterId,
                level: level,
                name: e.Name,
                rank: (function () {
                    switch (e.Rarity) {
                        case "QUALITY_PURPLE":
                            return 4;
                        case "QUALITY_ORANGE":
                            return 5;
                        default:
                            return -1;
                    }
                })(),
                element: e.Element,
                weaponType: e.Weapon,
                baseHP: getBaseStat(e, "HP"),
                baseATK: getBaseStat(e, "ATK"),
                baseDEF: getBaseStat(e, "DEF"),
                ascStat: ascStat as AttributeName,
                ascStatValue: ascStatValue,
                normal: {
                    name: e.Skills[0].Name,
                    description: e.Skills[0].Desc.replaceAll(
                        regexRemoveTalentLinks,
                        ""
                    ),
                    parameters: extractTalentParams(
                        parametersNA.Desc,
                        parametersNA.Param
                    ),
                },
                skill: {
                    name: e.Skills[1].Name,
                    description: e.Skills[1].Desc.replaceAll(
                        regexRemoveTalentLinks,
                        ""
                    ),
                    parameters: extractTalentParams(
                        parametersE.Desc,
                        parametersE.Param
                    ),
                },
                burst: {
                    name: e.Skills[e.Skills.length - 1].Name,
                    description: e.Skills[e.Skills.length - 1].Desc.replaceAll(
                        regexRemoveTalentLinks,
                        ""
                    ),
                    parameters: extractTalentParams(
                        parametersQ.Desc,
                        parametersQ.Param
                    ),
                },
                passiveA1: {
                    name: e.Passives[0].Name,
                    description: e.Passives[0].Desc.replaceAll(
                        regexRemoveTalentLinks,
                        ""
                    ),
                    parameters: takeUntil(
                        e.Passives[0].ParamList,
                        (curr) => curr == 0
                    ),
                },
                passiveA4: {
                    name: e.Passives[1].Name,
                    description: e.Passives[1].Desc.replaceAll(
                        regexRemoveTalentLinks,
                        ""
                    ),
                    parameters: takeUntil(
                        e.Passives[1].ParamList,
                        (curr) => curr == 0
                    ),
                },
                passiveUtil: {
                    name: e.Passives[2].Name,
                    description: e.Passives[2].Desc.replaceAll(
                        regexRemoveTalentLinks,
                        ""
                    ),
                },
                constellations: {
                    1: {
                        name: e.Constellations[0].Name,
                        description: e.Constellations[0].Desc.replaceAll(
                            regexRemoveTalentLinks,
                            ""
                        ),
                        parameters: takeUntil(
                            e.Constellations[0].ParamList,
                            (curr) => curr == 0
                        ),
                    },
                    2: {
                        name: e.Constellations[1].Name,
                        description: e.Constellations[1].Desc.replaceAll(
                            regexRemoveTalentLinks,
                            ""
                        ),
                        parameters: takeUntil(
                            e.Constellations[1].ParamList,
                            (curr) => curr == 0
                        ),
                    },
                    3: {
                        name: e.Constellations[2].Name,
                        description: e.Constellations[2].Desc,
                        upgradedTalent: (() => {
                            const talentName = e.Constellations[2].Desc.replace(
                                regexTalentFromC3_C5,
                                "$1"
                            );

                            const talentIndex = normalize(
                                e.Skills.findIndex(
                                    (it) => it.Name == talentName
                                ),
                                { max: 2 }
                            );

                            const currTalent = e.Skills[talentIndex];
                            const currTalentScaling =
                                currTalent.Promote[
                                    `${talentLevels[talentIndex] + 3 - 1}`
                                ];

                            return {
                                name: currTalent.Name,
                                description: currTalent.Desc.replaceAll(
                                    regexRemoveTalentLinks,
                                    ""
                                ),
                                parameters: extractTalentParams(
                                    currTalentScaling.Desc,
                                    currTalentScaling.Param
                                ),
                            };
                        })(),
                    },
                    4: {
                        name: e.Constellations[3].Name,
                        description: e.Constellations[3].Desc.replaceAll(
                            regexRemoveTalentLinks,
                            ""
                        ),
                        parameters: takeUntil(
                            e.Constellations[3].ParamList,
                            (curr) => curr == 0
                        ),
                    },
                    5: {
                        name: e.Constellations[4].Name,
                        description: e.Constellations[4].Desc,
                        upgradedTalent: (() => {
                            const talentName = e.Constellations[4].Desc.replace(
                                regexTalentFromC3_C5,
                                "$1"
                            );

                            const talentIndex = normalize(
                                e.Skills.findIndex(
                                    (it) => it.Name == talentName
                                ),
                                { max: 2 }
                            );

                            const currTalent = e.Skills[talentIndex];
                            const currTalentScaling =
                                currTalent.Promote[
                                    `${talentLevels[talentIndex] + 3 - 1}`
                                ];

                            return {
                                name: currTalent.Name,
                                description: currTalent.Desc.replaceAll(
                                    regexRemoveTalentLinks,
                                    ""
                                ),
                                parameters: extractTalentParams(
                                    currTalentScaling.Desc,
                                    currTalentScaling.Param
                                ),
                            };
                        })(),
                    },
                    6: {
                        name: e.Constellations[5].Name,
                        description: e.Constellations[5].Desc.replaceAll(
                            regexRemoveTalentLinks,
                            ""
                        ),
                        parameters: takeUntil(
                            e.Constellations[5].ParamList,
                            (curr) => curr == 0
                        ),
                    },
                },
            };
            if (e.Passives.length > 3) {
                character.passiveSpecial = {
                    name: e.Passives[3].Name,
                    description: e.Passives[3].Desc.replaceAll(
                        regexRemoveTalentLinks,
                        ""
                    ),
                    parameters: takeUntil(
                        e.Passives[3].ParamList,
                        (curr) => curr == 0
                    ),
                };
            }
            return character;
        });

    function getBaseStat(
        character: HakushinCharacter,
        stat: "HP" | "ATK" | "DEF"
    ): number {
        let statName: `FIGHT_PROP_BASE_${"HP" | "ATTACK" | "DEFENSE"}` | null =
            null;
        switch (stat) {
            case "HP":
                statName = "FIGHT_PROP_BASE_HP";
                break;
            case "ATK":
                statName = "FIGHT_PROP_BASE_ATTACK";
                break;
            case "DEF":
                statName = "FIGHT_PROP_BASE_DEFENSE";
                break;
            default:
                throw new Error("Unreachable");
        }

        return (
            character[`Base${stat}`] *
                character.StatsModifier[stat][`${level}`] +
            character.StatsModifier.Ascension[ascension - 1][statName!]
        );
    }

    function extractTalentParams(
        descs: string[],
        params: number[]
    ): { [key: string]: string } {
        const output: Array<[string, string]> = descs
            .filter((value) => value.length > 0)
            .reduce<Array<[string, string]>>((prev, curr) => {
                const [descMV, paramMV] = curr.split("|");

                const paramMV_treated = paramMV.replaceAll(
                    /\{([^{}:]*):([^{}:]*)\}/g,
                    (_, param: string, modifier: string) => {
                        const paramIndex =
                            Number(param.replace(/^param/, "")) - 1;
                        let paramValue: number = params[paramIndex];

                        const modifiers = {
                            isPercent: modifier.toLowerCase().includes("p"),
                            isFloat: modifier.toLowerCase().includes("f"),
                            decimalPlaces: Number(
                                (modifier.match(/[1-9]/) ?? ["0"])[0]
                            ),
                        };

                        paramValue *= modifiers.isPercent ? 100 : 1;

                        let output = modifiers.isFloat
                            ? paramValue.toFixed(modifiers.decimalPlaces)
                            : paramValue.toFixed(0);
                        output += modifiers.isPercent ? "%" : "";

                        return output;
                    }
                );

                return [...prev, [descMV, paramMV_treated]];
            }, []);
        return Object.fromEntries(output);
    }
} // TODO: Implement

async function fetchWeapon({
    characterId,
    level = 90,
    talentLevels = [9, 9, 9],
    ascension,
}: {
    characterId: string;
    level?: RangeNum<1, 91> | 95 | 100;
    talentLevels?: [number, number, number];
    ascension?: number;
}): Promise<Character | void> {}
// TODO: Implement

async function fetchArtifact({
    characterId,
    level = 90,
    talentLevels = [9, 9, 9],
    ascension,
}: {
    characterId: string;
    level?: RangeNum<1, 91> | 95 | 100;
    talentLevels?: [number, number, number];
    ascension?: number;
}): Promise<Character | void> {}
export async function fetchCharacterList(): Promise<[string, string][] | null> {
    return await fetch("https://api.hakush.in/gi/data/character.json")
        .then((e) => e.json())
        .then((json: { [key: string]: { [key: string]: any } }) => {
            const characters: [string, string][] = Object.entries(json)
                .map<[string, string] | undefined>((e) => {
                    const id: string = e[0];
                    let name: string = e[1]["EN"];
                    const element: string = e[1]["element"];
                    if (["10000005", "10000117"].includes(id.slice(0, -2))) {
                        // "10000005" Aether
                        // "10000117" Manekin
                        name += ` (${element})`;
                    }
                    if (["10000007", "10000118"].includes(id.slice(0, -2))) {
                        // "10000007" Lumine
                        // "10000118" Manekina
                        // name += ` (${element})`;
                        return;
                    }

                    return [id, name];
                })
                .filter((e) => e != null);
            return characters;
        })
        .catch((e) => {
            return null;
            console.error(e);
        });
}
export async function fetchWeaponList(): Promise<Weapon[] | null> {
    return await fetch("https://api.hakush.in/gi/data/weapon.json")
        .then((e) => Object.entries(e.json()))
        .then((value) =>
            value.map((it) => {
                const weapon = it[1];
                return {
                    id: it[0],
                    rank: weapon["rank"],
                    name: weapon["EN"],
                    type: weapon["type"],
                };
            })
        )
        .catch((e) => {
            console.error(e);
            return null;
        });
}
