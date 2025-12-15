import { Character } from "./types";
import { HakushinCharacter } from "./types/hakushinTypes";
import { RangeNum } from "./types/helperTypes";
import { AttributeName } from "./types/otherTypes";
import { $, baseApiURL, normalize } from "./utils.js";

main();

function main() {
    $("#btn-start-calc")[0].addEventListener("click", inputAndCalc);
}

function inputAndCalc() {
    const characterID = prompt("Enter characterID")!;

    fetchCharacter(characterID).then((e) => console.log(e));
}

async function fetchCharacter(
    characterId: string,
    level: RangeNum<1, 91> | 95 | 100 = 90,
    talentLevels: [number, number, number] = [9, 9, 9],
    ascension?: number
): Promise<Character | void> {
    const _ascension =
        ascension ??
        (level > 20 ? 1 : 0) +
            (level > 40 ? 1 : 0) +
            (level > 50 ? 1 : 0) +
            (level > 60 ? 1 : 0) +
            (level > 70 ? 1 : 0) +
            (level > 80 ? 1 : 0);
    const regexExtractC3_5 =
        /.*<color[^<>]*>(?:\{[^<>{}]*\})?([^<>{}]+)(?:\{[^<>{}]*\})?<\/color[^<>]*>.*/;

    return await fetch(`${baseApiURL}/data/en/character/${characterId}.json`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    })
        .then((e) => e.json())
        .then((e: HakushinCharacter) => {
            const [ascStat, ascStatValue] = Object.entries(
                e.StatsModifier.Ascension[_ascension - 1]
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
                name: e.Name,
                id: characterId,
                rank: e.Rarity == "QUALITY_PURPLE" ? 4 : 5,
                element: e.Element,
                base_hp: e.BaseHP,
                base_atk: e.BaseATK,
                base_def: e.BaseDEF,
                asc_stat: ascStat as AttributeName,
                asc_stat_value: ascStatValue,
                normal: {
                    name: e.Skills[0].Name,
                    description: e.Skills[0].Desc,
                    parameters: extractTalentParams(
                        parametersNA.Desc,
                        parametersNA.Param
                    ),
                },
                skill: {
                    name: e.Skills[1].Name,
                    description: e.Skills[1].Desc,
                    parameters: extractTalentParams(
                        parametersE.Desc,
                        parametersE.Param
                    ),
                },
                burst: {
                    name: e.Skills[e.Skills.length - 1].Name,
                    description: e.Skills[e.Skills.length - 1].Desc,
                    parameters: extractTalentParams(
                        parametersQ.Desc,
                        parametersQ.Param
                    ),
                },
                a1_passive: {
                    name: e.Passives[0].Name,
                    description: e.Passives[0].Desc,
                    parameters: e.Passives[0].ParamList,
                },
                a4_passive: {
                    name: e.Passives[1].Name,
                    description: e.Passives[1].Desc,
                    parameters: e.Passives[1].ParamList,
                },
                util_passive: {
                    name: e.Passives[2].Name,
                    description: e.Passives[2].Desc,
                },
                constellations: {
                    1: {
                        name: e.Constellations[0].Name,
                        description: e.Constellations[0].Desc,
                        parameters: e.Constellations[0].ParamList.filter(
                            (value) => value != 0
                        ),
                    },
                    2: {
                        name: e.Constellations[1].Name,
                        description: e.Constellations[1].Desc,
                        parameters: e.Constellations[1].ParamList.filter(
                            (value) => value != 0
                        ),
                    },
                    3: {
                        name: e.Constellations[2].Name,
                        description: e.Constellations[2].Desc,
                        upgradedTalent: (() => {
                            const talentName = e.Constellations[2].Desc.replace(
                                regexExtractC3_5,
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
                                description: currTalent.Desc,
                                parameters: extractTalentParams(
                                    currTalentScaling.Desc,
                                    currTalentScaling.Param
                                ),
                            };
                        })(),
                    },
                    4: {
                        name: e.Constellations[3].Name,
                        description: e.Constellations[3].Desc,
                        parameters: e.Constellations[3].ParamList.filter(
                            (value) => value != 0
                        ),
                    },
                    5: {
                        name: e.Constellations[4].Name,
                        description: e.Constellations[4].Desc,
                        upgradedTalent: (() => {
                            const talentName = e.Constellations[4].Desc.replace(
                                regexExtractC3_5,
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
                                description: currTalent.Desc,
                                parameters: extractTalentParams(
                                    currTalentScaling.Desc,
                                    currTalentScaling.Param
                                ),
                            };
                        })(),
                    },
                    6: {
                        name: e.Constellations[5].Name,
                        description: e.Constellations[5].Desc,
                        parameters: e.Constellations[5].ParamList.filter(
                            (value) => value != 0
                        ),
                    },
                },
            };
            if (e.Passives.length > 3) {
                character.special_passive = {
                    name: e.Passives[3].Name,
                    description: e.Passives[3].Desc,
                    parameters: e.Passives[3].ParamList,
                };
            }
            return character;
        });

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
}

function getEnemyStats() {
    return {
        level: 100,
        res: 0.1,
        resAnemo: 0.1,
        resCryo: 0.1,
        resDendro: 0.1,
        resElectro: 0.1,
        resGeo: 0.1,
        resHydro: 0.1,
        resPyro: 0.1,
        resPhysical: 0.1,
    };
}
