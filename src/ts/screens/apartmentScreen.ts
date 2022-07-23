import {Color, GameScreen, KeyboardInput, MouseButton, Renderer, ScreenChangeEvent} from "@alexayers/teenytinytwodee";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {Vampire} from "../data/vampire";
import {NpcManager} from "../data/npc";


export class ApartmentScreen implements GameScreen {

    init(): void {
    }

    keyboard(keyCode: number): void {
        if (keyCode == KeyboardInput.A) {
            EventBus.publish(new ScreenChangeEvent("activity"));
        } else if (keyCode == KeyboardInput.Y) {
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

        Renderer.print("You at your apartment", 50,50, "Arial", 50, new Color(0,0,0));

        Renderer.print("Y: Look at yearbook", 50,100, "Arial", 50, new Color(0,0,0));

        if (Vampire.calling) {

            Renderer.print("A: Go to Activity with " + NpcManager.getNpc(Vampire.calling).firstName, 50, 200, "Arial", 50, new Color(0,0,0));


        }


    }

    onEnter(): void {
    }

    onExit(): void {
    }


}
