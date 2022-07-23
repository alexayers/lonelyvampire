import {getRandomArrayElement} from "@alexayers/teenytinytwodee";
import {NpcManager} from "./npc";
import {Vampire} from "./vampire";

const vampyConversation= require("../../resources/data/vampyConversation.json");
const npcConversation = require("../../resources/data/npcConversation.json");


export class ConversationManager {

    static getNpcOpeningLine(): string {

        let randIdx : number = getRandomArrayElement(npcConversation.activity.start);
        return npcConversation.activity.start[randIdx];
    }

    static getVampyOpeningLine() : string {
        let randIdx : number = getRandomArrayElement(vampyConversation.activity.start);
        let line : string = vampyConversation.activity.start[randIdx];

        if (line.includes("name")) {
            let npc = NpcManager.getNpc(Vampire.calling);
            line = line.replace("[name]", npc.firstName);
        }

        return line;
    }


    static getNpcMiddleLine() : string {
        let randIdx : number = getRandomArrayElement(npcConversation.activity.middle);
        return npcConversation.activity.middle[randIdx];
    }

    static getVampyMiddleLine(): string {
        let randIdx : number = getRandomArrayElement(vampyConversation.activity.middle);
        let line : string = vampyConversation.activity.middle[randIdx];

        if (line.includes("name")) {
            let npc = NpcManager.getNpc(Vampire.calling);
            line = line.replace("[name]", npc.firstName);
        }

        return line;
    }
}
