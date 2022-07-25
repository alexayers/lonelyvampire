import {
    ButtonWidget,
    Color,
    GameScreen,
    getRandomBetween,
    KeyboardInput,
    MouseButton,
    Renderer,
    ScreenChangeEvent, WidgetManager
} from "@alexayers/teenytinytwodee";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {Vampy} from "../data/vampy";
import {Npc, NpcManager} from "../data/npc";
import {PhoneConversationManager} from "../data/conversation";
import {ButtonWidgetBuilder} from "@alexayers/teenytinytwodee/dist/ts/lib/ui/buttonWidget";
import {LabelWidgetBuilder} from "@alexayers/teenytinytwodee/dist/ts/lib/ui/labelWidget";


export class ApartmentScreen implements GameScreen {


    private _backgroundColor: Color;
    private _widgetManger : WidgetManager;

    init(): void {
        this._backgroundColor = new Color(56,56,56);

        this._widgetManger = new WidgetManager();

        let yearBook : ButtonWidget = new ButtonWidgetBuilder(450,250,250,250)
            .withCallBack(() => {
                EventBus.publish(new ScreenChangeEvent("yearbook"));
            })
            .withColor(new Color(90,90,0))
            .withHoverColor(new Color(90,90, 190))
            .build();


        this._widgetManger.register(yearBook);
    }

    keyboard(keyCode: number): void {


    }

    logicLoop(): void {
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
        this._widgetManger.mouseClick(x,y, mouseButton);
    }

    mouseMove(x: number, y: number): void {
        this._widgetManger.mouseMove(x,y);
    }

    renderLoop(): void {
        Renderer.rect(0,0, 1024,768, this._backgroundColor);
        Renderer.print("You at your apartment", 50,50, "Arial", 50, new Color(0,0,0));

    //    Renderer.print("Y: Look at yearbook", 50,100, "Arial", 50, new Color(0,0,0));


        Vampy.render(-80,200, 512,512);

        Renderer.rect(0, 700, 1024, 70, new Color(0,0,0));


        this._widgetManger.render();
    }

    onEnter(): void {

    }

    onExit(): void {

    }


}
