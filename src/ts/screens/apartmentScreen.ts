import {
    Color,
    GameScreen,
    getRandomBetween,
    KeyboardInput,
    MouseButton,
    Renderer,
    ScreenChangeEvent
} from "@alexayers/teenytinytwodee";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {Vampire} from "../data/vampire";
import {Npc, NpcManager} from "../data/npc";
import {PhoneConversationManager} from "../data/conversation";


export class ApartmentScreen implements GameScreen {


    private _backgroundColor: Color;

    init(): void {
        this._backgroundColor = new Color(56,56,56);
    }

    keyboard(keyCode: number): void {
       if (keyCode == KeyboardInput.Y) {
            EventBus.publish(new ScreenChangeEvent("yearbook"));
        }



    }

    logicLoop(): void {
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    renderLoop(): void {
        Renderer.rect(0,0, 1024,768, this._backgroundColor);
        Renderer.print("You at your apartment", 50,50, "Arial", 50, new Color(0,0,0));

        Renderer.print("Y: Look at yearbook", 50,100, "Arial", 50, new Color(0,0,0));



        Renderer.rect(0, 700, 1024, 70, new Color(0,0,0));

    }

    onEnter(): void {

    }

    onExit(): void {

    }


}
