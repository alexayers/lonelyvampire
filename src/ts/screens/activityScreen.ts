import {
    Color,
    GameEvent,
    GameScreen,
    KeyboardInput,
    MouseButton,
    Renderer,
    RGBtoHex,
    ScreenChangeEvent
} from "@alexayers/teenytinytwodee";
import {Vampire} from "../data/vampire";
import {Npc, NpcManager} from "../data/npc";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {ConversationManager} from "../data/conversation";


export class ActivityScreen implements GameScreen {

    private _color: Color;
    private _npcOpeningComplete: boolean = false;
    private _vampyOpeningComplete :boolean = false;

    private _npcDialogue : string = "";
    private _vampyDialogue : string = ";"
    private _npc: Npc;

    init(): void {
        this._color = new Color(0,0,0);

    }

    onEnter(): void {
        this._npcOpeningComplete = false;
        this._vampyOpeningComplete = false;
        this._npcDialogue = "";
        this._vampyDialogue = "";
        this._npc = NpcManager.getNpc(Vampire.calling);
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
            }
        } else  if (keyCode == KeyboardInput.B) {
        //    this._friendShip--;
        } else if (keyCode == KeyboardInput.C) {
       //     this._friendShip++;
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
        Renderer.rect(50,350, 256,512, new Color(0,0,0));
        Renderer.rect(950,350, 256,512, new Color(0,0,0));

        Renderer.print(this._npc.firstName + " : " + this._npcDialogue, 350,350, "Arial", 12, this._color);

        Renderer.print("(V)ampy: " + this._vampyDialogue, 350,400, "Arial", 12, this._color);

        Renderer.print("Exposure: " + Vampire.exposure, 200, 50,"Arial", 25, this._color);
        Renderer.print("Total Friends: " + Vampire.totalFriends, 500, 50,"Arial", 25, this._color);
       // Renderer.print("Friendship: " + this._friendShip, 700, 50,"Arial", 25, this._color);
    }

}
