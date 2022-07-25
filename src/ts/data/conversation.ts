import {getRandomArrayElement} from "@alexayers/teenytinytwodee";
import {NpcManager} from "./npc";
import {Vampy} from "./vampy";
import {ActivityManager} from "./activityManager";

const vampyConversation= require("../../resources/data/vampyConversation.json");
const npcConversation = require("../../resources/data/npcConversation.json");

const activityConversation = require("../../resources/data/activityConversation.json");


export class PhoneConversationManager {

    static getNpcOpeningPhoneLine(): string {
        let randIdx : number = getRandomArrayElement(npcConversation.phoneCall.start);
        let line = npcConversation.phoneCall.start[randIdx];

        if (line.includes("favoriteActivity")) {
            let npc = NpcManager.getNpc(Vampy.calling);
            line = line.replace("[favoriteActivity]", npc.favoriteActivity);
        }

        return line;
    }

    static getVampyPositiveOpeningPhoneLine(): string {
        let randIdx : number = getRandomArrayElement(vampyConversation.phoneCall.goodChoice);
        let line = vampyConversation.phoneCall.goodChoice[randIdx];

        if (line.includes("favoriteActivity")) {
            let npc = NpcManager.getNpc(Vampy.calling);
            line = line.replace("[favoriteActivity]", npc.favoriteActivity);
        }

        return line;
    }

    static getVampyNeutralOpeningPhoneLine(): string {
        let randIdx : number = getRandomArrayElement(vampyConversation.phoneCall.neutralChoice);
        let line = vampyConversation.phoneCall.neutralChoice[randIdx];

        if (line.includes("favoriteActivity")) {
            let npc = NpcManager.getNpc(Vampy.calling);
            line = line.replace("[favoriteActivity]", npc.favoriteActivity);
        }

        if (line.includes("neutralActivity")) {
            let npc = NpcManager.getNpc(Vampy.calling);
            line = line.replace("[neutralActivity]", ActivityManager.getRandomNeutralActivity().activity);
        }

        return line;
    }

    static getVampyNegativeOpeningPhoneLine(): string {
        let randIdx : number = getRandomArrayElement(vampyConversation.phoneCall.badChoice);
        let line = vampyConversation.phoneCall.badChoice[randIdx];

        if (line.includes("favoriteActivity")) {
            let npc = NpcManager.getNpc(Vampy.calling);
            line = line.replace("[favoriteActivity]", npc.favoriteActivity);
        }

        if (line.includes("dislikedActivity")) {
            let npc = NpcManager.getNpc(Vampy.calling);
            line = line.replace("[dislikedActivity]", npc.dislikes);
        }

        return line;
    }

    static getNpcPositivePhoneClosing(): string {
        let randIdx : number = getRandomArrayElement(npcConversation.phoneCall.goodEnding);
        return npcConversation.phoneCall.goodEnding[randIdx];
    }

    static getNpcNegativePhoneClosing() : string {
        let randIdx : number = getRandomArrayElement(npcConversation.phoneCall.badEnding);
        return npcConversation.phoneCall.badEnding[randIdx];
    }

    static getVampyOpeningPhoneLine() : string {
        let randIdx : number = getRandomArrayElement(vampyConversation.phoneCall.start);
        let line : string = vampyConversation.phoneCall.start[randIdx];

        if (line.includes("name")) {
            let npc = NpcManager.getNpc(Vampy.calling);
            line = line.replace("[name]", npc.firstName);
        }

        return line;
    }


}

export class ActivityConversationManager {

    private static substitutions(line : string) : string {
        let npc = NpcManager.getNpc(Vampy.calling);

        console.log(npc.firstName);

        if (line.includes("name")) {

            line = line.replace("[name]", npc.firstName);
        }

        if (line.includes("favoriteActivity")) {
            line = line.replace("[favoriteActivity]", npc.favoriteActivity);
        }

        if (line.includes("neutralActivity")) {
            line = line.replace("[neutralActivity]", ActivityManager.getRandomNeutralActivity().activity);
        }

        return line;
    }

    static getNpcGreetingLine(): string {

        let randIdx : number = getRandomArrayElement(activityConversation.opening.npc.preferredActivity);
        let line : string = activityConversation.opening.npc.preferredActivity[randIdx];
        return ActivityConversationManager.substitutions(line);
    }


    static getVampyGreeting() {
        let randIdx : number = getRandomArrayElement(activityConversation.opening.vampy.greeting);
        let line : string = activityConversation.opening.vampy.greeting[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getVampyFirstResponsePositive() {
        let randIdx : number = getRandomArrayElement(activityConversation.opening.vampy.responses.good);
        let line : string = activityConversation.opening.vampy.responses.good[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getVampyFirstResponseNeutral() {
        let randIdx : number = getRandomArrayElement(activityConversation.opening.vampy.responses.neutral);
        let line : string = activityConversation.opening.vampy.responses.neutral[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getVampyFirstResponseNegative() {
        let randIdx : number = getRandomArrayElement(activityConversation.opening.vampy.responses.bad);
        let line : string = activityConversation.opening.vampy.responses.bad[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getNpcSecondResponsePositive() {
        let randIdx : number = getRandomArrayElement(activityConversation.activityCommitment.npc.good);
        let line : string = activityConversation.activityCommitment.npc.good[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getNpcSecondResponseNeutral() {
        let randIdx : number = getRandomArrayElement(activityConversation.activityCommitment.npc.neutral);
        let line : string = activityConversation.activityCommitment.npc.neutral[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getNpcSecondResponseNegative() {
        let randIdx : number = getRandomArrayElement(activityConversation.activityCommitment.npc.bad);
        let line : string = activityConversation.activityCommitment.npc.bad[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getVampyCommitmentPositive() {
        let randIdx : number = getRandomArrayElement(activityConversation.activityCommitment.vampy.good);
        let line : string = activityConversation.activityCommitment.vampy.good[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getVampyCommitmentNegative() {
        let randIdx : number = getRandomArrayElement(activityConversation.activityCommitment.vampy.bad);
        let line : string = activityConversation.activityCommitment.vampy.bad[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getRandomIntermission() {
        let randIdx : number = getRandomArrayElement(activityConversation.interstitial);
        let line : string = activityConversation.interstitial[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getNpcFinalPrompt() {
        let randIdx : number = getRandomArrayElement(activityConversation.closing.npc);
        let line : string = activityConversation.closing.npc[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getVampyFinalChoicePositive() {
        let randIdx : number = getRandomArrayElement(activityConversation.final.vampy.good);
        let line : string = activityConversation.final.vampy.good[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getVampyFinalChoiceNeutral() {
        let randIdx : number = getRandomArrayElement(activityConversation.final.vampy.neutral);
        let line : string = activityConversation.final.vampy.neutral[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getVampyFinalChoiceNegatve() {
        let randIdx : number = getRandomArrayElement(activityConversation.final.vampy.bad);
        let line : string = activityConversation.final.vampy.bad[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getNpcFinalReplyGood() {
        let randIdx : number = getRandomArrayElement(activityConversation.final.npc.good);
        let line : string = activityConversation.final.npc.good[randIdx];
        return ActivityConversationManager.substitutions(line);
    }

    static getNpcFinalReplyNegative() {
        let randIdx : number = getRandomArrayElement(activityConversation.final.npc.bad);
        let line : string = activityConversation.final.npc.bad[randIdx];
        return ActivityConversationManager.substitutions(line);
    }
}
