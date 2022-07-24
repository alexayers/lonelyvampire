import {
    Color,
    GameScreen,
    KeyboardInput,
    logger,
    LogType,
    MouseButton,
    Renderer,
    ScreenChangeEvent
} from "@alexayers/teenytinytwodee";
import {Vampire} from "../data/vampire";
import {Npc, NpcManager} from "../data/npc";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {ConversationManager} from "../data/conversation";
import {Activity, ActivityManager} from "../data/activityManager";


export class ActivityScreen implements GameScreen {

    private _color: Color;
    private _npcOpeningComplete: boolean = false;
    private _vampyOpeningComplete :boolean = false;

    private _npcDialogue : string = "";
    private _vampyDialogue : string = ";"
    private _npc: Npc;
    private _activity: Activity;

    init(): void {
        this._color = new Color(0,0,0);

    }

    onEnter(): void {
        this._npcOpeningComplete = false;
        this._vampyOpeningComplete = false;
        this._npcDialogue = "";
        this._vampyDialogue = "";
        this._npc = NpcManager.getNpc(Vampire.calling);

        let activityName = this._npc.favoriteActivity;
        this._activity = ActivityManager.getActivity(activityName);

        logger(LogType.INFO, JSON.stringify(this._activity));

    }

    onExit(): void {

    }

    keyboard(keyCode: number): void {

        if (keyCode == KeyboardInput.V) {
            if (!this._vampyOpeningComplete) {
                this._vampyDialogue = ConversationManager.getVampyOpeningLine();
                this._vampyOpeningComplete = true;
            } else {
                this._npcDialogue = ConversationManager.getNpcMiddleLine();
                this._vampyDialogue = ConversationManager.getVampyMiddleLine();

                console.log(this._activity);

                switch (this._activity.exposure) {
                    case 'L':
                        Vampire.exposure += 1;
                        break;
                    case 'M':
                        Vampire.exposure += 2;
                        break;
                    case 'H':
                        Vampire.exposure += 3;
                        break;
                }


            }
        } else if (keyCode == KeyboardInput.H) {
            EventBus.publish(new ScreenChangeEvent("apartment"));
        }
    }

    logicLoop(): void {

        if (!this._npcOpeningComplete) {
            this._npcDialogue = ConversationManager.getNpcOpeningLine();
            this._npcOpeningComplete = true;
        }
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    renderLoop(): void {
        Renderer.rect(0,0, 1024,768, this._activity.backgroundColor);
        Renderer.rect(50,350, 256,512, new Color(0,0,0));
        Renderer.rect(950,350, 256,512, new Color(0,0,0));

        Renderer.print(this._npc.firstName + " : " + this._npcDialogue, 350,350, "Arial", 12, this._color);

        Renderer.print("Vampy: " + this._vampyDialogue, 350,400, "Arial", 12, this._color);

        Renderer.print("Activity: " + this._activity.activity, 100, 200,"Arial", 25, this._color);

        Renderer.print("Press V to talk", 100, 300,"Arial", 25, this._color);

        Renderer.print("Friendship: " + this._npc.friendShip, 100, 50,"Arial", 25, this._color);
        Renderer.print("Exposure: " + Vampire.exposure, 300, 50,"Arial", 25, this._color);
        Renderer.print("Total Friends: " + Vampire.totalFriends, 700, 50,"Arial", 25, this._color);
       // Renderer.print("Friendship: " + this._friendShip, 700, 50,"Arial", 25, this._color);
    }

}
