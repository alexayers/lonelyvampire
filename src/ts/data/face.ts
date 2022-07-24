import {Color, getRandomArrayElement, getRandomBetween, Renderer, Sprite} from "@alexayers/teenytinytwodee";

const json = require("../../resources/data/face.json");

export class FaceManager {

    static _body: Array<Sprite> = [];
    static _neck: Array<Sprite> = [];
    static _head: Array<Sprite> = [];

    static _shirt: Array<Sprite> = [];

    static _mouth: Array<Sprite> = [];
    static _nose: Array<Sprite> = [];
    static _eyes: Array<Sprite> = [];
    static _eyebrows: Array<Sprite> = [];
    static _hair: Array<Sprite> = [];


    static init(): void {

        console.log(json);

        json.body.forEach((filename: string) => {
            FaceManager._body.push(new Sprite(256, 256, require("../../resources/image/" + filename)));
        });

        json.neck.forEach((filename: string) => {
            FaceManager._neck.push(new Sprite(256, 256, require("../../resources/image/" + filename)));
        });

        json.head.forEach((filename: string) => {
            FaceManager._head.push(new Sprite(256, 256, require("../../resources/image/" + filename)));
        });

        json.shirt.forEach((filename: string) => {
            FaceManager._shirt.push(new Sprite(256, 256, require("../../resources/image/" + filename)));
        });

        json.mouth.forEach((filename: string) => {
            FaceManager._mouth.push(new Sprite(256, 256, require("../../resources/image/" + filename)));
        });

        json.eyes.forEach((filename: string) => {
            FaceManager._eyes.push(new Sprite(256, 256, require("../../resources/image/" + filename)));
        });

        json.eyebrows.forEach((filename: string) => {
            FaceManager._eyebrows.push(new Sprite(256, 256, require("../../resources/image/" + filename)));
        });

        json.nose.forEach((filename: string) => {
            FaceManager._nose.push(new Sprite(256, 256, require("../../resources/image/" + filename)));
        });

        json.mouth.forEach((filename: string) => {
            FaceManager._mouth.push(new Sprite(256, 256, require("../../resources/image/" + filename)));
        });

        json.hair.forEach((filename: string) => {
            FaceManager._hair.push(new Sprite(256, 256, require("../../resources/image/" + filename)));
        });
    }

    static getRandomFace(): Face {

        let face: Face = new Face();
        face.body = FaceManager._body[getRandomArrayElement(FaceManager._body)];
        face.eyebrows = FaceManager._eyebrows[getRandomArrayElement(FaceManager._eyebrows)];
        face.eyes = FaceManager._eyes[getRandomArrayElement(FaceManager._eyes)];
        face.hair = FaceManager._hair[getRandomArrayElement(FaceManager._hair)];
        face.mouth = FaceManager._mouth[getRandomArrayElement(FaceManager._mouth)];

        switch (getRandomBetween(1,4)) {
            case 1:
                face.head = FaceManager._head[0];
                face.neck = FaceManager._neck[0];
                break;
            case 2:
                face.head = FaceManager._head[1];
                face.neck = FaceManager._neck[1];
                break;
            case 3:
                face.head = FaceManager._head[2];
                face.neck = FaceManager._neck[2];
                break;
            case 4:
                face.head = FaceManager._head[3];
                face.neck = FaceManager._neck[3];
                break;
        }

        face.nose = FaceManager._nose[getRandomArrayElement(FaceManager._nose)];
        face.shirt = FaceManager._shirt[getRandomArrayElement(FaceManager._shirt)];


        return face;

    }

}

export class Face {
    private _body: Sprite
    private _neck: Sprite
    private _head: Sprite
    private _shirt: Sprite
    private _mouth: Sprite
    private _nose: Sprite
    private _eyes: Sprite
    private _eyebrows: Sprite
    private _hair: Sprite
    private _backgroundColor: Color;

    private _blinkTick : number;
    private _blinkRate: number;

    private _tick: number;
    private _maxTick :number;

    private _breathIn : boolean = true;
    private _width : number = 0;

    constructor() {
        this._backgroundColor = new Color(getRandomBetween(10,255),getRandomBetween(30,255),getRandomBetween(30,255));
        this._tick = 0;
        this._blinkTick = 0;
        this._maxTick = 12;
        this._blinkRate = 90;
    }


    get body(): Sprite {
        return this._body;
    }

    set body(value: Sprite) {
        this._body = value;
    }

    get neck(): Sprite {
        return this._neck;
    }

    set neck(value: Sprite) {
        this._neck = value;
    }

    get head(): Sprite {
        return this._head;
    }

    set head(value: Sprite) {
        this._head = value;
    }

    get shirt(): Sprite {
        return this._shirt;
    }

    set shirt(value: Sprite) {
        this._shirt = value;
    }

    get mouth(): Sprite {
        return this._mouth;
    }

    set mouth(value: Sprite) {
        this._mouth = value;
    }

    get nose(): Sprite {
        return this._nose;
    }

    set nose(value: Sprite) {
        this._nose = value;
    }

    get eyes(): Sprite {
        return this._eyes;
    }

    set eyes(value: Sprite) {
        this._eyes = value;
    }

    get eyebrows(): Sprite {
        return this._eyebrows;
    }

    set eyebrows(value: Sprite) {
        this._eyebrows = value;
    }

    get hair(): Sprite {
        return this._hair;
    }

    set hair(value: Sprite) {
        this._hair = value;
    }

    renderYearbook(x: number, y: number, dimension: number) {

        Renderer.rect(x, y, dimension,dimension, this._backgroundColor);

        Renderer.renderImage(this._body.image,x, y, dimension,dimension);
        Renderer.renderImage(this._shirt.image,x, y, dimension,dimension);
        Renderer.renderImage(FaceManager._neck[0].image,x, y, dimension,dimension);
        Renderer.renderImage(this._neck.image,x, y, dimension,dimension);
        Renderer.renderImage(FaceManager._head[0].image,x, y, dimension,dimension);
        Renderer.renderImage(this._head.image,x, y, dimension,dimension);
        Renderer.renderImage(this._mouth.image,x, y, dimension,dimension);
        Renderer.renderImage(this._nose.image,x, y, dimension,dimension);
        Renderer.renderImage(this._eyes.image,x, y, dimension,dimension);
        Renderer.renderImage(this._eyebrows.image,x, y, dimension,dimension);
        Renderer.renderImage(this._hair.image,x, y, dimension,dimension);

    }

    renderConversation(x: number, y: number, dimension: number) {



        Renderer.renderImage(this._body.image,x, y, dimension + this._width,dimension + this._width);
        Renderer.renderImage(this._shirt.image,x, y, dimension + this._width,dimension + this._width);
        Renderer.renderImage(FaceManager._neck[0].image,x, y, dimension + this._width,dimension + this._width);
        Renderer.renderImage(this._neck.image,x, y, dimension + this._width,dimension + this._width);
        Renderer.renderImage(FaceManager._head[0].image,x, y+ this._width, dimension,dimension);
        Renderer.renderImage(this._head.image,x, y+ this._width, dimension,dimension);
        Renderer.renderImage(this._mouth.image,x, y+ this._width, dimension,dimension);
        Renderer.renderImage(this._nose.image,x, y+ this._width, dimension,dimension);

        if (this._blinkTick <= this._blinkRate) {
            Renderer.renderImage(this._eyes.image,x, y+ this._width, dimension,dimension);
        } else {
            if (this._blinkTick > this._blinkRate + 10) {
                this._blinkRate = getRandomBetween(80, 120);
                this._blinkTick = 0;
            }

        }

        Renderer.renderImage(this._eyebrows.image,x, y+ this._width, dimension,dimension);
        Renderer.renderImage(this._hair.image,x, y+ this._width, dimension,dimension);

        if (this._tick == this._maxTick) {
            this._tick = 0;

            if (this._breathIn) {
                this._width++;
            } else {
                this._width--;
            }

        }

        if (this._width == 4) {
            this._breathIn = false;
        } else if (this._width == 0) {
            this._breathIn = true;
        }



        this._blinkTick++;
        this._tick++;
    }
}
