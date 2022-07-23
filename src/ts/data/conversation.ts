import {getRandomArrayElement} from "@alexayers/teenytinytwodee";
import {NpcManager} from "./npc";
import {Vampire} from "./vampire";
import {ActivityManager} from "./activityManager";

const vampyConversation= require("../../resources/data/vampyConversation.json");
const npcConversation = require("../../resources/data/npcConversation.json");


export class ConversationManager {

    static getNpcOpeningPhoneLine(): string {
        let randIdx : number = getRandomArrayElement(npcConversation.phoneCall.start);
        let line = npcConversation.phoneCall.start[randIdx];

        if (line.includes("favoriteActivity")) {
            let npc = NpcManager.getNpc(Vampire.calling);
            line = line.replace("[favoriteActivity]", npc.favoriteActivity);
        }

        return line;
    }

    static getVampyPositiveOpeningPhoneLine(): string {
        let randIdx : number = getRandomArrayElement(vampyConversation.phoneCall.goodChoice);
        let line = vampyConversation.phoneCall.goodChoice[randIdx];

        if (line.includes("favoriteActivity")) {
            let npc = NpcManager.getNpc(Vampire.calling);
            line = line.replace("[favoriteActivity]", npc.favoriteActivity);
        }

        return line;
    }

    static getVampyNeutralOpeningPhoneLine(): string {
        let randIdx : number = getRandomArrayElement(vampyConversation.phoneCall.neutralChoice);
        let line = vampyConversation.phoneCall.neutralChoice[randIdx];

        if (line.includes("favoriteActivity")) {
            let npc = NpcManager.getNpc(Vampire.calling);
            line = line.replace("[favoriteActivity]", npc.favoriteActivity);
        }

        if (line.includes("neutralActivity")) {
            let npc = NpcManager.getNpc(Vampire.calling);
            line = line.replace("[neutralActivity]", ActivityManager.getRandomNeutralActivity().activity);
        }

        return line;
    }

    static getVampyNegativeOpeningPhoneLine(): string {
        let randIdx : number = getRandomArrayElement(vampyConversation.phoneCall.badChoice);
        let line = vampyConversation.phoneCall.badChoice[randIdx];

        if (line.includes("favoriteActivity")) {
            let npc = NpcManager.getNpc(Vampire.calling);
            line = line.replace("[favoriteActivity]", npc.favoriteActivity);
        }

        if (line.includes("dislikedActivity")) {
            let npc = NpcManager.getNpc(Vampire.calling);
            line = line.replace("[dislikedActivity]", npc.dislikes);
        }

        return line;
    }

    static getNpcPositiveClosing(): string {
        let randIdx : number = getRandomArrayElement(npcConversation.phoneCall.goodEnding);
        return npcConversation.phoneCall.goodEnding[randIdx];
    }

    static getNpcNegativeClosing() : string {
        let randIdx : number = getRandomArrayElement(npcConversation.phoneCall.badEnding);
        return npcConversation.phoneCall.badEnding[randIdx];
    }

    static getNpcOpeningLine(): string {

        let randIdx : number = getRandomArrayElement(npcConversation.activity.start);
        return npcConversation.activity.start[randIdx];
    }

    static getVampyOpeningLine() : string {
        let randIdx : number = getRandomArrayElement(vampyConversation.phoneCall.start);
        let line : string = vampyConversation.phoneCall.start[randIdx];

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
