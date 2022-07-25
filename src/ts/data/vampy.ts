import {getRandomBetween, Renderer, Sprite} from "@alexayers/teenytinytwodee";


export class Vampy {

    private static _totalFriends : number = 0;
    private static _exposure : number = 0;
    private static _hunger: number = 0;
    private static _calling : string;
    private static _activity : string;

    private static _body: Sprite = new Sprite(0,0, require("../../resources/image/body.png"));
    private static _head : Sprite = new Sprite(0,0, require("../../resources/image/head.png"));
    private static _neck : Sprite = new Sprite(0,0, require("../../resources/image/neck.png"));
    private static _shirt : Sprite = new Sprite(0,0, require("../../resources/image/vampy/vamyShirt.png"));
    private static _mouth: Sprite = new Sprite(0,0, require("../../resources/image/vampy/vampyMouth.png"));
    private static _nose: Sprite = new Sprite(0,0, require("../../resources/image/vampy/vampyNose.png"));
    private static _eyes: Sprite = new Sprite(0,0, require("../../resources/image/vampy/vampyEyes.png"));
    private static _hair: Sprite = new Sprite(0,0, require("../../resources/image/vampy/vampyHair.png"));
    private static _eyeBrows: Sprite = new Sprite(0,0, require("../../resources/image/vampy/vampEyebrows.png"));

    private static _blinkTick : number =0;
    private static _blinkRate: number = 120;

    private static _tick: number = 0;
    private static _maxTick :number = 12;

    private static _breathIn : boolean = true;
    private static _width : number = 0;

    static get activity(): string {
        return this._activity;
    }

    static set activity(value: string) {
        this._activity = value;
    }

    static get hunger(): number {
        return this._hunger;
    }

    static set hunger(value: number) {
        this._hunger = value;
    }

    static get totalFriends(): number {
        return this._totalFriends;
    }

    static set totalFriends(value: number) {
        this._totalFriends = value;
    }

    static get exposure(): number {
        return this._exposure;
    }

    static set exposure(value: number) {
        this._exposure = value;
    }

    static get calling(): string {
        return this._calling;
    }

    static set calling(value: string) {
        this._calling = value;
    }

    static render(x: number, y: number, width: number, height: number) : void {

        Renderer.renderImage(Vampy._body.image, x, y, width+ Vampy._width, height+ Vampy._width);
        Renderer.renderImage(Vampy._shirt.image, x, y, width+ Vampy._width, height+ Vampy._width);
        Renderer.renderImage(Vampy._neck.image, x, y, width+ Vampy._width, height+ Vampy._width);
        Renderer.renderImage(Vampy._head.image, x, y+ Vampy._width, width, height);
        Renderer.renderImage(Vampy._mouth.image, x, y+ Vampy._width, width, height);
        Renderer.renderImage(Vampy._nose.image, x, y+ Vampy._width, width, height);

        if (Vampy._blinkTick <= Vampy._blinkRate) {
            Renderer.renderImage(Vampy._eyes.image,x, y+ Vampy._width, width,height);
        } else {
            if (Vampy._blinkTick > Vampy._blinkRate + 10) {
                Vampy._blinkRate = getRandomBetween(80, 120);
                Vampy._blinkTick = 0;
            }

        }

        Renderer.renderImage(Vampy._eyeBrows.image, x, y+ Vampy._width, width, height);
        Renderer.renderImage(Vampy._hair.image, x, y+ Vampy._width, width, height);

        if (Vampy._tick == Vampy._maxTick) {
            Vampy._tick = 0;

            if (Vampy._breathIn) {
                Vampy._width++;
            } else {
                Vampy._width--;
            }

        }

        if (Vampy._width == 4) {
            Vampy._breathIn = false;
        } else if (Vampy._width == 0) {
            Vampy._breathIn = true;
        }



        Vampy._blinkTick++;
        Vampy._tick++;
    }
}
