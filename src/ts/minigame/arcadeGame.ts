import {MiniGame, Player} from "./miniGame";
import {Color, getRandomArrayElement, getRandomBetween, Renderer, Sprite} from "@alexayers/teenytinytwodee";


export class ArcadeGame extends MiniGame {

    private _gameShift = Date.now();
    private _lastWinner : number = 0;

    gamePlayLogic(): void {

        if (Date.now() > this._gameShift + 10_000) {

            this._gameShift = Date.now();
            let randIdx : number = getRandomArrayElement(this._items);

            this._items[this._lastWinner].objectType = "arcadeMachine";
            this._items[this._lastWinner].sprite = new Sprite(0,0,require("../../resources/image/minigames/arcadeMachine.png"));

            this._items[randIdx].objectType = "winner";
            this._items[randIdx].sprite = new Sprite(0,0,require("../../resources/image/minigames/arcadeHighSore.png"));

            this._lastWinner = randIdx;
        }

    }

    getTotalTime(): number {
        return 60;
    }

    initGame(): void {

        this.initPlayer();

        let offsetX : number = 100;
        let offsetY : number = 100;

        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 5; x++) {

                this._items.push({
                    x: offsetX,
                    y: offsetY,
                    sprite: new Sprite(0, 0, require("../../resources/image/minigames/arcadeMachine.png")),
                    objectType: "arcadeMachine",
                    wall: true,
                    width: 32,
                    height: 64
                });

                offsetX += 200;
            }

            offsetX = 100
            offsetY += 200;
        }

        let randIdx : number = getRandomArrayElement(this._items);

        this._lastWinner = randIdx;

        this._items[randIdx].objectType = "winner";
        this._items[randIdx].sprite = new Sprite(0,0,require("../../resources/image/minigames/arcadeHighSore.png"));

        this._enemies.push({
            x: 570,
            y: 560,
            speed: 20,
            timePerMove: 128,
            lastMove: Date.now(),
            objectType: "friend",
            findItem: "winner",
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/friend.png"))
        });
    }

    initPlayer(): void {
        this._player = {
            speed: 16,
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/player1.png")),
            x: 500,
            y: 550
        }
    }

    instruction(): void {
    }

    loseState(): boolean {
        return false;
    }

    playerTouchesEnemy(enemy: string, enemyIdx: number, x: number, y: number): void {
    }

    playerTouchesItem(item: string, itemIdx: number, x: number, y: number): void {

        if (item == "arcadeMachine") {

        }
    }

    renderGame(): void {
        Renderer.rect(0,0,1024,768, new Color(86,42,113))
    }

    enemyTouchesItem(item: string, itemIdx: number, x: number, y: number): void {
    }

}
