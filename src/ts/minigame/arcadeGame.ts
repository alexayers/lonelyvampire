import {MiniGame} from "./miniGame";
import {Color, getRandomArrayElement, getRandomBetween, Renderer, Sprite} from "@alexayers/teenytinytwodee";
import {Npc, NpcManager} from "../data/npc";
import {Vampy} from "../data/vampy";


export class ArcadeGame extends MiniGame {

    private _gameShift = Date.now();
    private _lastWinner : number = 0;

    private _wave: number = Date.now();

    gamePlayLogic(): void {

        if (Date.now() > this._wave + 2_000) {

            this._wave = Date.now();

            if (getRandomBetween(1, 100) < 50) {
                this._enemies.push({
                    x: -500,
                    y: getRandomBetween(0,600),
                    speed: 20,
                    timePerMove: 128,
                    lastMove: Date.now(),
                    objectType: "bully",
                    findEnemy: "friend",
                    sprite: new Sprite(0, 0, require("../../resources/image/minigames/bully.png"))
                });
            } else {
                this._enemies.push({
                    x: 1500,
                    y: getRandomBetween(0,600),
                    speed: 20,
                    timePerMove: 128,
                    lastMove: Date.now(),
                    objectType: "bully",
                    findEnemy: "friend",
                    sprite: new Sprite(0, 0, require("../../resources/image/minigames/bully.png"))
                });
            }

        }


        if (Date.now() > this._gameShift + 5_000) {

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
        return 40;
    }

    initGame(): void {

        this.initPlayer();

        let offsetX : number = 100;
        let offsetY : number = 100;

        this._items.push({
            x: -500,
            y: 0,
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/arcadeMachine.png")),
            objectType: "exit",
            wall: true,
            width: 32,
            height: 64
        });


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
            speed: 25,
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/player1.png")),
            x: 500,
            y: 550
        }
    }

    instruction(): void {
        let npc: Npc = NpcManager.getNpc(Vampy.calling);
        let dialogue: string = "Vampy, I'm trying to get a high score on my favorite games. Keep the bullies away from me.";

        Renderer.rect(148, 298, 695, 105, new Color(0, 0, 0));
        Renderer.rect(150, 300, 690, 100, new Color(52, 189, 235));

        Renderer.print(dialogue, 180, 340, "Arial", 16, new Color(255, 255, 255));


        Renderer.rect(288, 448, 455, 205, new Color(0, 0, 0));
        Renderer.rect(290, 450, 450, 200, new Color(199, 58, 93));

        Renderer.print("I'll protect you! [press enter]", 300, 480, "Arial", 16, new Color(0, 0, 0));

        npc.face.renderConversation(-80, 350, 384);
        Vampy.render(680, 350, 384, 384);
    }

    loseState(): boolean {
        return false;
    }

    playerTouchesEnemy(enemy: string, enemyIdx: number, x: number, y: number): void {

        if (enemy == "bully" && this._enemies[enemyIdx].findItem != "exit") {
            this._enemies[enemyIdx].findItem = "exit"
            this._enemies[enemyIdx].sprite = new Sprite(0,0, require("../../resources/image/minigames/bullyAfraid.png"));
            let npc = NpcManager.getNpc(Vampy.calling);
            npc.friendShip++;
        }
    }

    playerTouchesItem(item: string, itemIdx: number, x: number, y: number): void {

        if (item == "arcadeMachine") {
            console.log("i touched it");
        }
    }

    renderGame(): void {
        Renderer.rect(0,0,1024,768, new Color(86,42,113))
    }

    enemyTouchesItem(item: string, itemIdx: number, x: number, y: number): void {

        if (item == "friend") {

        }
    }

}
