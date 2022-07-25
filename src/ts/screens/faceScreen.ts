import {Color, GameScreen, getRandomBetween, MouseButton, Renderer} from "@alexayers/teenytinytwodee";
import {Face, FaceManager} from "../data/face";
import {Faker} from "@faker-js/faker";


export class FaceScreen implements GameScreen {

    private _delay: number = 0;
    private _background: Color;
    private _face : Face;

    init(): void {
        this._delay = Date.now();
        this._background = new Color(getRandomBetween(1,255),getRandomBetween(1,255),getRandomBetween(1,255));
        this._face = FaceManager.getRandomFace();
    }

    keyboard(keyCode: number): void {
    }

    logicLoop(): void {

        if (Date.now() > this._delay + 150) {
            this._delay = Date.now();
            this._background = new Color(getRandomBetween(1,255),getRandomBetween(1,255),getRandomBetween(1,255));
            this._face = FaceManager.getRandomFace();
        }

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

        Renderer.rect(0,0, 1024, 768, this._background);

        Renderer.print("Class of 1983", 350, 35, "Helvitca", 40, new Color(255,255,255));

        this._face.renderYearbook(150,50, 640);



    }



}
