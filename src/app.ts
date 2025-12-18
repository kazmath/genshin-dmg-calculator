import * as fetchFunctions from "./fetchFunctions.js";
import { CharacterStats } from "./types";
import { $ } from "./utils.js";

const defaultStats = {
    artifacts: {},
    BaseHP: 0,
    BaseATK: 0,
    BaseDEF: 0,
};
const characterSlots: [
    CharacterStats?,
    CharacterStats?,
    CharacterStats?,
    CharacterStats?
] = [
    { ...defaultStats },
    { ...defaultStats },
    { ...defaultStats },
    { ...defaultStats },
];
let weapons = null;
const getWeapons = async () =>
    weapons ?? (await fetchFunctions.fetchWeaponList());

main();

async function main() {
    // Inject the version from package.json into the page
    injectVersion();

    populateCharacterSlots((await fetchFunctions.fetchCharacterList()) ?? []);

    injectEventListeners();
    // $("#btn-start-calc")[0].addEventListener("click", inputAndCalc);
}

function calculate() {
    $(
        "#output"
    )[0].innerHTML = `<textarea style="width:100%;height:100%">${JSON.stringify(
        characterSlots,
        null,
        2
    )}</textarea>`;
}

function inputAndCalc() {
    const characterID = prompt("Enter characterID")!;
    fetch("");

    fetchFunctions.fetchCharacter(characterID).then((e) => console.log(e));
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

function injectVersion() {
    const href = location.href;
    fetch(`${href.substring(0, href.lastIndexOf("/"))}/package.json`)
        .then((data) => data.json())
        .then((data) => {
            $("#package-version")[0].innerHTML = `v${data.version}`;
        })
        .catch(function (e) {
            console.error("Error loading package.json:", e);
        });
}

function injectEventListeners() {
    // onchange: character selectors
    for (let index = 0; index < 4; index++) {
        const selectTagId = `#character-slot-${index + 1}`;
        $(selectTagId)[0].addEventListener("change", async (ev) => {
            const currSlot = characterSlots[index]!;

            const charId = (ev.target as HTMLSelectElement)!.value;
            const character = await fetchFunctions.fetchCharacter(charId);
            currSlot.character = character;
            currSlot.BaseATK = character.baseATK;
            currSlot.BaseDEF = character.baseDEF;
            currSlot.BaseHP = character.baseHP;

            $(`#weapon-slot-${index + 1}`)[0];

            switch (character.weaponType) {
                case "WEAPON_SWORD_ONE_HAND":
                    break;
                case "WEAPON_CLAYMORE":
                    break;
                case "WEAPON_POLE":
                    break;
                case "WEAPON_CATALYST":
                    break;
                case "WEAPON_BOW":
                    break;
            }
        });
    }

    // onclick output box
    $("#output")[0].addEventListener("click", (_) => calculate());
}

function populateCharacterSlots(_chars: [string, string][]): void {
    const chars = _chars.toSorted((a, b) => {
        return a[1] > b[1] ? 1 : -1;
    });

    const fragList = [
        document.createDocumentFragment(),
        document.createDocumentFragment(),
        document.createDocumentFragment(),
        document.createDocumentFragment(),
    ];
    fragList.forEach((frag) => {
        const firstOption = document.createElement("option");
        firstOption.selected = true;
        firstOption.text = "Choose a Character";

        frag.append(firstOption);
    });

    for (const char of chars) {
        fragList.forEach((frag) => {
            const option = document.createElement("option");
            option.value = char[0];
            option.text = char[1];

            frag.append(option);
        });
    }

    $(".character-slots .loading-option").forEach((option) => option.remove());

    $("#character-slot-1")[0].append(fragList[0]);
    $("#character-slot-1")[0].removeAttribute("disabled");

    $("#character-slot-2")[0].append(fragList[1]);
    $("#character-slot-2")[0].removeAttribute("disabled");

    $("#character-slot-3")[0].append(fragList[2]);
    $("#character-slot-3")[0].removeAttribute("disabled");

    $("#character-slot-4")[0].append(fragList[3]);
    $("#character-slot-4")[0].removeAttribute("disabled");
}
