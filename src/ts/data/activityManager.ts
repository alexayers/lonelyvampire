import {getRandomArrayElement} from "@alexayers/teenytinytwodee";

const json = require("../../resources/data/activities.json");


export class ActivityManager {
    private static _activityMap: Map<string, Activity> = new Map<string, Activity>();
    private static _favoriteActivities: Array<string> = [];
    private static _neutralActivities: Array<string> = [];

    static init() {

        json.forEach((activity : Activity) => {
            ActivityManager._activityMap.set(activity.activity, activity);

            if (activity.neutral) {
                ActivityManager._neutralActivities.push(activity.activity);
            } else {
                ActivityManager._favoriteActivities.push(activity.activity);
            }

        })
    }

    static getRandomActivity() : Activity {
        let randIdx = getRandomArrayElement(ActivityManager._favoriteActivities);
        return ActivityManager._activityMap.get( ActivityManager._favoriteActivities[randIdx]);
    }

    static getActivity(activityName : string) : Activity {
        return ActivityManager._activityMap.get(activityName);
    }

    static getRandomNeutralActivity() : Activity {
        let randIdx = getRandomArrayElement(ActivityManager._neutralActivities);
        return ActivityManager._activityMap.get( ActivityManager._neutralActivities[randIdx]);
    }
}

export interface Activity {
    activity: string
    exposure: string
    yearbook: string
    neutral: boolean
}
