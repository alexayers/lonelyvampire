import {GameScreen, TeenyTinyTwoDeeApp} from "@alexayers/teenytinytwodee";
import {ExampleGameScreen} from "./exampleGameScreen";
import {ActivityScreen} from "../screens/activityScreen";
import {ApartmentScreen} from "../screens/apartmentScreen";
import {Activities} from "../data/activities";
import {YearBookScreen} from "../screens/yearBookScreen";
import {NpcManager} from "../data/npc";


export class LonelyVampire extends TeenyTinyTwoDeeApp {

    init() {

        Activities.init();
        NpcManager.init(6);


        let gameScreens : Map<string, GameScreen> = new Map<string, GameScreen>();
        gameScreens.set("activity", new ActivityScreen());
        gameScreens.set("apartment", new ApartmentScreen());
        gameScreens.set("yearbook", new YearBookScreen());

        this.run({
            "audioEnabled": true
        }, gameScreens, "apartment");
    }

}
