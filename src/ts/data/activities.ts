import {getRandomArrayElement} from "@alexayers/teenytinytwodee";

const json = require("../../resources/data/activities.json");

export enum Weight {
    H = 10,
    M = 5,
    L = 2
}

export class Activities {
    private static _activityMap: Map<string, Activity> = new Map<string, Activity>();
    private static _activies: Array<string> = [];

    static init() {

        json.forEach((activity : Activity) => {
            Activities._activityMap.set(activity.activity, activity);
            Activities._activies.push(activity.activity);
        })
    }

    static getRandomActivity() : Activity {
        let randIdx = getRandomArrayElement(Activities._activies);
        return Activities._activityMap.get( Activities._activies[randIdx]);
    }


}

export interface Activity {
    activity: string
    exposure: Weight
    hunger: Weight
}
