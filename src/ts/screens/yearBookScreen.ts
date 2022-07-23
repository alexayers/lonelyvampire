import {Color, GameScreen, KeyboardInput, MouseButton, Renderer, ScreenChangeEvent} from "@alexayers/teenytinytwodee";
import {NpcManager} from "../data/npc";
import {Vampire} from "../data/vampire";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";

export class YearBookScreen implements GameScreen {

    init(): void {

    }

    keyboard(keyCode: number): void {

        if (keyCode == KeyboardInput.ONE) {
            Vampire.calling = NpcManager.getNpcs()[0].id;
            EventBus.publish(new ScreenChangeEvent("apartment"));
        } else if (keyCode == KeyboardInput.TWO) {
            Vampire.calling = NpcManager.getNpcs()[1].id;
            EventBus.publish(new ScreenChangeEvent("apartment"));
        }else if (keyCode == KeyboardInput.THREE) {
            Vampire.calling = NpcManager.getNpcs()[2].id;
            EventBus.publish(new ScreenChangeEvent("apartment"));
        }else if (keyCode == KeyboardInput.FOUR) {
            Vampire.calling = NpcManager.getNpcs()[3].id;
            EventBus.publish(new ScreenChangeEvent("apartment"));
        }else if (keyCode == KeyboardInput.FIVE) {
            Vampire.calling = NpcManager.getNpcs()[4].id;
            EventBus.publish(new ScreenChangeEvent("apartment"));
        }else if (keyCode == KeyboardInput.SIX) {
            Vampire.calling = NpcManager.getNpcs()[5].id;
            EventBus.publish(new ScreenChangeEvent("apartment"));
        }

    }

    logicLoop(): void {
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    onEnter(): void {
    }

    onExit(): void {
    }

    renderLoop(): void {
        Renderer.print("Yearbook Class of 1983", 50,50, "Arial", 50, new Color(0,0,0));

        let offsetY :number = 0;
        let i : number = 1;

        NpcManager._npcs.forEach((npc) => {

            Renderer.print(npc.firstName + " " + npc.lastName, 50, 100 + offsetY, "Arial", 16, new Color(0,0,0));
            Renderer.print("Likes: " + npc.yearBook, 50, 120 + offsetY, "Arial", 16, new Color(0,0,0));
            Renderer.print("Press (" + i + ") to call " +  npc.firstName, 50, 140 + offsetY, "Arial", 16, new Color(0,0,0));
            i++;

            offsetY += 100;

        });


    }

}
