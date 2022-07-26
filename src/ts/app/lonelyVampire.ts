import {GameScreen, TeenyTinyTwoDeeApp} from "@alexayers/teenytinytwodee";
import {ActivityScreen} from "../screens/activityScreen";
import {ApartmentScreen} from "../screens/apartmentScreen";
import {ActivityManager} from "../data/activityManager";
import {YearBookScreen} from "../screens/yearBookScreen";
import {NpcManager} from "../data/npc";
import {FaceManager} from "../data/face";
import {PhoneCallScreen} from "../screens/phoneCallScreen";
import {FaceScreen} from "../screens/faceScreen";
import {BeachGame} from "../minigame/beachGame";
import {MiniGameScreen} from "../minigame/miniGameScreen";


export class LonelyVampire extends TeenyTinyTwoDeeApp {

    init() {

        FaceManager.init();
        ActivityManager.init();
        NpcManager.init(15);


        let gameScreens : Map<string, GameScreen> = new Map<string, GameScreen>();
        gameScreens.set("activity", new ActivityScreen());
        gameScreens.set("apartment", new ApartmentScreen());
        gameScreens.set("yearbook", new YearBookScreen());
        gameScreens.set("phoneCall", new PhoneCallScreen());
        gameScreens.set("face", new FaceScreen());
        gameScreens.set("beach", new MiniGameScreen());

        this.run({
            "audioEnabled": true
        }, gameScreens, "beach");
    }

}
