import {
    ButtonWidget,
    Color,
    GameScreen, getRandomBetween,
    KeyboardInput,
    MouseButton,
    Renderer,
    ScreenChangeEvent,
    WidgetManager
} from "@alexayers/teenytinytwodee";
import {NpcManager} from "../data/npc";
import {Vampire} from "../data/vampire";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {FaceManager} from "../data/face";
import {ButtonWidgetBuilder} from "@alexayers/teenytinytwodee/dist/ts/lib/ui/buttonWidget";

export class YearBookScreen implements GameScreen {

    private _backgroundColor: Color;
    private _widgetManager: WidgetManager;

    init(): void {

        this._backgroundColor = new Color(190,190, 190);
        this._widgetManager = new WidgetManager();

        let offsetY: number = 100;
        let offsetX: number = 50;
        let i: number = 0;


        NpcManager._npcs.forEach((npc) => {

            let button: ButtonWidget = new ButtonWidgetBuilder(offsetX,offsetY, 128, 128)
                .withHoverColor(new Color(0,0,90))
                .withCallBack(()=>{
                    Vampire.calling = npc.id;
                    EventBus.publish(new ScreenChangeEvent("phoneCall"));
                })
                .build();


            offsetY += 225;

            this._widgetManager.register(button);

            i++;

            if (i == 3) {
                offsetY = 100;
                offsetX += 180;
                i = 0;
            }

        });
    }

    keyboard(keyCode: number): void {

        /*
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
        }*/

        if (keyCode == KeyboardInput.ESCAPE) {
            EventBus.publish(new ScreenChangeEvent("apartment"));
        }

    }

    logicLoop(): void {

    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
        this._widgetManager.mouseClick(x,y, mouseButton);
    }

    mouseMove(x: number, y: number): void {
        this._widgetManager.mouseMove(x,y);
    }

    onEnter(): void {
    }

    onExit(): void {
    }

    renderLoop(): void {
        Renderer.rect(0,0, 1024,768, this._backgroundColor);

        Renderer.print("Yearbook Class of 1983", 250,50, "Arial", 50, new Color(0,0,0));

        let offsetY :number = 100;
        let offsetX : number = 50;
        let i : number = 0;

        NpcManager._npcs.forEach((npc) => {

            npc.face.renderYearbook(offsetX,offsetY, 128);
            offsetY += 150;
            Renderer.print(npc.firstName + " " + npc.lastName, offsetX,  offsetY, "Arial", 16, new Color(0,0,0));
            offsetY += 25;

            Renderer.print("Likes: " + npc.yearBook, offsetX,  offsetY, "Arial", 10, new Color(0,0,0));
            i++;

            offsetY += 50;

            if (i == 3) {
                offsetY = 100;
                offsetX += 180;
                i =0;
            }

        });

        this._widgetManager.render();

        Renderer.print("(Escape) to return to apartment", 400, 80, "Arial", 14, new Color(0,0,0));
    }

}
