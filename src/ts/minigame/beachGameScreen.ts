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
import {Direction, Enemy, GameStage, MiniGame, MiniGameScreen} from "./miniGameScreen";

export class BeachGameScreen extends MiniGameScreen implements MiniGame {

    private _waveTick: number = 0;
    private _wave: number = 0;
    private _rollIn: boolean = false;

    private _stoppedCrabs: number = 0;
    private _lastWave: number = 0;
    private _sandCastles: number;


    init(): void {

        AudioManager.register("kill", require("../../resources/image/minigames/kill.wav"), false);
        AudioManager.register("pickup", require("../../resources/image/minigames/pickup.wav"), false);
        AudioManager.register("destroy", require("../../resources/image/minigames/destroy.wav"), false);

        this.initPlayer();
        this.initGame();

        this.setLooseState(() => {
            if (this._sandCastles == 0) {
                this._gameStage = GameStage.END;
                EventBus.publish(new ScreenChangeEvent("activity"));
            }
        });

        this.setGameContinue(() => {
            return this._sandCastles > 0 && this._totalTime > 0
        });

        this.setGamePlayLogic(this.gamePlayLogic);
    }

    initPlayer() : void {
        this._player = {
            speed: 16,
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/player1.png")),
            x: 450,
            y: 120
        }

        this.playerCollisionHandler("crab", (enemyIdx: number, x: number, y: number) => {
            this._enemies[enemyIdx] = null;
            AudioManager.play("kill");

            this._score++;

            this._items.push({
                x: x,
                y: y,
                objectType: "deadCrab",
                sprite: new Sprite(0, 0, require("../../resources/image/minigames/deadCrab.png"))
            })

            this._stoppedCrabs++;
        });
    }

    initGame(): void {

        this._lastWave = Date.now();
        this._totalTime = 20;
        this._sandCastles = 3;

        this._enemies.push({
            x: getRandomBetween(-50, 900),
            y: getRandomBetween(-50, 20),
            speed: 6,
            timePerMove: 128,
            lastMove: Date.now(),
            objectType: "crab",
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/crab.png"))
        });

        this._items.push({
            x: getRandomBetween(50, 300),
            y: getRandomBetween(300, 700),
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/sandCastle.png")),
            objectType: "sandCastle"
        });

        this._items.push({
            x: getRandomBetween(300, 600),
            y: getRandomBetween(300, 700),
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/sandCastle.png")),
            objectType: "sandCastle"
        });

        this._items.push({
            x: getRandomBetween(600, 900),
            y: getRandomBetween(300, 700),
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/sandCastle.png")),
            objectType: "sandCastle"
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
                sprite: new Sprite(0, 0, require("../../resources/image/minigames/crab.png"))
            });
        }

        for (let i = 0; i < this._enemies.length; i++) {

            if (this._enemies[i] == null) {
                continue;
            }

            let enemy: Enemy = this._enemies[i];

            if (Date.now() < enemy.lastMove + enemy.timePerMove) {
                continue
            }

            enemy.lastMove = Date.now();

            let direction: Direction = this.findItem(enemy.x, enemy.y, "sandCastle");

            switch (direction) {
                case Direction.UP:
                    if ((enemy.y - enemy.speed) > 0) {
                        enemy.y -= enemy.speed;
                        this.breakSandCastle(enemy.x, enemy.y - enemy.speed);
                    }
                    break;
                case Direction.DOWN:
                    if ((enemy.y + enemy.speed) < 700) {
                        enemy.y += enemy.speed;
                        this.breakSandCastle(enemy.x, enemy.y + enemy.speed);
                    }
                    break;
                case Direction.LEFT:
                    if ((enemy.x - enemy.speed) > 0) {
                        enemy.x -= enemy.speed;
                        this.breakSandCastle(enemy.x - enemy.speed, enemy.y);
                    }
                    break;
                case Direction.RIGHT:
                    if ((enemy.x + enemy.speed) < 970) {
                        enemy.x += enemy.speed;
                        this.breakSandCastle(enemy.x + enemy.speed, enemy.y);
                    }
                    break;
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

                this._score -= 5;
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


        for (let i = 0; i < this._items.length; i++) {

            if (this._items[i] == null) {
                continue;
            }
            Renderer.renderImage(this._items[i].sprite.image, this._items[i].x, this._items[i].y, 64, 64);
        }

        for (let i = 0; i < this._enemies.length; i++) {

            if (this._enemies[i] == null) {
                continue;
            }
            Renderer.renderImage(this._enemies[i].sprite.image, this._enemies[i].x, this._enemies[i].y, 64, 64);
        }


        Renderer.renderImage(this._player.sprite.image, this._player.x, this._player.y, 64, 64);


        Renderer.print("Friend Score: " + this._score, 100, 32, "Inconsolata, monospace", 16, new Color(255, 255, 255));
        Renderer.print("Time Remaining: " + this._totalTime + " seconds", 400, 32, "Inconsolata, monospace", 16, new Color(255, 255, 255));
        Renderer.print("Exposure", 700, 32, "Inconsolata, monospace", 16, new Color(255, 255, 255));
        Renderer.rect(800, 20, 128, 16, new Color(255, 255, 255));

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

    renderLoop(): void {

        this.renderGame();

        if (this._gameStage == GameStage.INSTRUCTIONS) {
            this.instruction();
        } else if (this._gameStage == GameStage.END) {

        }

        Renderer.rect(0, 700, 1024, 70, new Color(0, 0, 0));
    }
}
