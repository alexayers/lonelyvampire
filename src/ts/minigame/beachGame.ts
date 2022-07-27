import {
    AudioManager,
    Color,
    getRandomBetween,
    Renderer,
    ScreenChangeEvent,
    Sprite
} from "@alexayers/teenytinytwodee";
import {Npc, NpcManager} from "../data/npc";
import {Vampy} from "../data/vampy";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {Item, MiniGame} from "./miniGame";

export class BeachGame extends MiniGame {


    private _waveTick: number = 0;
    private _wave: number = 0;
    private _rollIn: boolean = false;

    private _stoppedCrabs: number = 0;
    private _lastWave: number = 0;
    private _sandCastles: number;

    initPlayer() : void {
        this._player = {
            speed: 16,
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/player1.png")),
            x: 450,
            y: 120
        }
    }

    playerTouchesItem(item: string, itemIdx: number, x: number, y: number): void {

    }

    playerTouchesEnemy(enemy: string, enemyIdx: number, x: number, y: number): void {

        if (enemy == "crab") {
            this._enemies[enemyIdx] = null;
            AudioManager.play("kill");

            let npc : Npc = NpcManager.getNpc(Vampy.calling);
            npc.friendShip++;

            this._items.push({
                x: x,
                y: y,
                objectType: "deadCrab",
                sprite: new Sprite(0, 0, require("../../resources/image/minigames/deadCrab.png")),
                wall: false,
                width: 32,
                height: 32
            })

            this._stoppedCrabs++;
        }
    }


    getTotalTime(): number {
        return 20;
    }

    initGame(): void {

        AudioManager.register("kill", require("../../resources/image/minigames/kill.wav"), false);
        AudioManager.register("pickup", require("../../resources/image/minigames/pickup.wav"), false);
        AudioManager.register("destroy", require("../../resources/image/minigames/destroy.wav"), false);

        this.initPlayer();

        this._lastWave = Date.now();
        this._sandCastles = 3;

        this._enemies.push({
            x: getRandomBetween(-50, 900),
            y: getRandomBetween(-50, 20),
            speed: 6,
            timePerMove: 128,
            lastMove: Date.now(),
            objectType: "crab",
            findItem: "sandCastle",
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/crab.png"))
        });

        this._items.push({
            x: getRandomBetween(50, 300),
            y: getRandomBetween(300, 700),
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/sandCastle.png")),
            objectType: "sandCastle",
            wall: false,
            width: 32,
            height: 32
        });

        this._items.push({
            x: getRandomBetween(300, 600),
            y: getRandomBetween(300, 700),
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/sandCastle.png")),
            objectType: "sandCastle",
            wall: false,
            width: 32,
            height: 32
        });

        this._items.push({
            x: getRandomBetween(600, 900),
            y: getRandomBetween(300, 700),
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/sandCastle.png")),
            objectType: "sandCastle",
            wall: false,
            width: 32,
            height: 32
        });
    }

    gamePlayLogic(): void {
        if (Date.now() > this._lastWave + 2_000) {

            this._lastWave = Date.now();

            this._enemies.push({
                x: getRandomBetween(-50, 900),
                y: getRandomBetween(-50, 20),
                speed: 10,
                timePerMove: 128,
                lastMove: Date.now(),
                objectType: "crab",
                findItem: "sandCastle",
                sprite: new Sprite(0, 0, require("../../resources/image/minigames/crab.png"))
            });
        }


    }

    enemyTouchesItem(itemName: string, itemIdx: number, x: number, y: number) {

        if (itemName == "sandCastle") {

            let item : Item = this._items[itemIdx];

            if (x < (item.x + item.width) &&
                (x + item.width) > item.x &&
                y < (item.y + item.width) &&
                (y + item.width) > item.y
            ) {
                this._items[itemIdx] = null;

                let npc : Npc = NpcManager.getNpc(Vampy.calling);
                npc.friendShip -=5;

                this._sandCastles--;

                AudioManager.play("destroy");
                return true;
            }
        }

    }

    breakSandCastle(x: number, y: number): boolean {

        let width: number = 32;

        for (let i = 0; i < this._items.length; i++) {

            if (this._items[i] == null || this._items[i].objectType != "sandCastle") {
                continue;
            }

            if (x < (this._items[i].x + width) &&
                (x + width) > this._items[i].x &&
                y < (this._items[i].y + width) &&
                (y + width) > this._items[i].y
            ) {
                this._items[i] = null;

                let npc : Npc = NpcManager.getNpc(Vampy.calling);
                npc.friendShip -=5;

                this._sandCastles--;

                AudioManager.play("destroy");
                return true;
            }
        }

        return false;
    }

    instruction(): void {
        let npc: Npc = NpcManager.getNpc(Vampy.calling);
        let dialogue: string = "Oh no, Vampy! Those crabs are going to destroy our sand castles!";

        Renderer.rect(148, 298, 505, 105, new Color(0, 0, 0));
        Renderer.rect(150, 300, 500, 100, new Color(52, 189, 235));

        Renderer.print(dialogue, 180, 340, "Arial", 16, new Color(255, 255, 255));


        Renderer.rect(288, 448, 455, 205, new Color(0, 0, 0));
        Renderer.rect(290, 450, 450, 200, new Color(199, 58, 93));

        Renderer.print("I'll stop them! [press enter]", 300, 480, "Arial", 16, new Color(0, 0, 0));

        npc.face.renderConversation(-80, 350, 384);
        Vampy.render(680, 350, 384, 384);
    }

    renderGame(): void {
        Renderer.rect(0, 0, 1024, 768, new Color(226, 214, 159));
        Renderer.rect(0, 0, 1024, 65, new Color(189, 178, 132));
        Renderer.rect(0, 0, 1024, 50 + this._wave, new Color(39, 156 + (this._wave * 2), 219 + (this._wave * 2)));


        this._waveTick++;

        if (this._waveTick == 8) {
            this._waveTick = 0;

            if (this._rollIn) {
                this._wave++;

                if (this._wave > 12) {
                    this._rollIn = false;
                }

            } else {
                this._wave--;

                if (this._wave < 0) {
                    this._rollIn = true;
                }
            }
        }
    }


    loseState(): boolean {
        if (this._sandCastles == 0) {
            EventBus.publish(new ScreenChangeEvent("activity"));
            return true;
        }

        return false;
    }
}
