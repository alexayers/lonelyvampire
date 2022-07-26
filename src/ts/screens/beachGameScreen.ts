import {
    AudioManager,
    Color,
    GameScreen,
    getRandomBetween,
    KeyboardInput,
    MouseButton,
    Renderer, ScreenChangeEvent,
    Sprite
} from "@alexayers/teenytinytwodee";
import {GameEntity} from "@alexayers/teenytinytwodee/dist/ts/lib/ecs/entity/gameEntity";
import {Npc, NpcManager} from "../data/npc";
import {Vampy} from "../data/vampy";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {PersistentState} from "../data/persistentState";

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    STAY_PUT
}

export interface MapTile {
    tile: GameEntity;
    item: GameEntity;
    actor: GameEntity;
}

export interface Enemy {
    x: number
    y: number
    timePerMove: number
    speed: number
    sprite: Sprite
    lastMove: number
}

export enum ItemType {
    SAND_CASTLE,
    BUCKET,
    DEAD_CRAB
}

export interface Item {
    x: number
    y: number
    sprite: Sprite
    itemType: ItemType
}

export enum GameStage {
    INSTRUCTIONS,
    PLAY,
    END
}

export class BeachGameScreen implements GameScreen {


    private _player: Array<Sprite> = [];
    private _enemies: Array<Enemy> = [];
    private _items: Array<Item> = [];


    private _x: number = 450;
    private _y: number = 120;

    private _speed: number = 16;


    private _waveTick: number = 0;
    private _wave: number = 0;
    private _rollIn: boolean = false;

    private _stoppedCrabs: number = 0;

    private _lastWave : number = 0;

    private _totalTime : number;
    private _timePassed : number;

    private _score : number;
    private _sandCastles : number;

    private _gameStage: GameStage;


    init(): void {

        AudioManager.register("kill", require("../../resources/image/minigames/kill.wav"), false);
        AudioManager.register("pickup", require("../../resources/image/minigames/pickup.wav"), false);
        AudioManager.register("destroy", require("../../resources/image/minigames/destroy.wav"), false);

        this._player.push(new Sprite(0, 0, require("../../resources/image/minigames/player1.png")));
        this._player.push(new Sprite(0, 0, require("../../resources/image/minigames/player2.png")));
        this._player.push(new Sprite(0, 0, require("../../resources/image/minigames/player3.png")));

    }

    keyboard(keyCode: number): void {

        if (this._gameStage == GameStage.PLAY) {
            if (this._sandCastles > 0 && this._totalTime > 0) {
                this.gameControls(keyCode);
            }
        } else if (this._gameStage == GameStage.INSTRUCTIONS) {
            if (keyCode == KeyboardInput.ENTER) {
                this._gameStage = GameStage.PLAY;
            }
        } else if (this._gameStage == GameStage.END) {

        }


    }


    gameControls(keyCode: number) : void {
        if (keyCode == KeyboardInput.UP) {
            if ((this._y - this._speed) > 0) {

                if (!this.collisionDetected(this._x, this._y - this._speed)) {
                    this._y -= this._speed;
                }

            }
        } else if (keyCode == KeyboardInput.DOWN) {
            if ((this._y + this._speed) < 700) {

                if (!this.collisionDetected(this._x, this._y + this._speed)) {
                    this._y += this._speed;
                }
            }
        } else if (keyCode == KeyboardInput.LEFT) {
            if ((this._x - this._speed) > 0) {
                if (!this.collisionDetected(this._x - this._speed, this._y)) {
                    this._x -= this._speed;
                }

            }
        } else if (keyCode == KeyboardInput.RIGHT) {
            if ((this._x + this._speed) < 970) {

                if (!this.collisionDetected(this._x + this._speed, this._y)) {
                    this._x += this._speed;
                }
            }
        }
    }

    collisionDetected(x: number, y: number): boolean {


        let width: number = 32;

        for (let i = 0; i < this._items.length; i++) {

            if (this._items[i] == null) {
                continue;
            }

            if (x < (this._items[i].x + width) &&
                (x + width) > this._items[i].x &&
                y < (this._items[i].y + width) &&
                (y + width) > this._items[i].y
            ) {

                if (this._items[i].itemType == ItemType.BUCKET) {


                    AudioManager.play("pickup");

                    this._items[i] = null;
                }
            }
        }

        for (let i = 0; i < this._enemies.length; i++) {

            if (this._enemies[i] == null) {
                continue;
            }

            if (x < (this._enemies[i].x + width) &&
                (x + width) > this._enemies[i].x &&
                y < (this._enemies[i].y + width) &&
                (y + width) > this._enemies[i].y
            ) {

                this._enemies[i] = null;
                AudioManager.play("kill");

                this._score++;

                this._items.push({
                  x: x,
                  y: y,
                  itemType: ItemType.DEAD_CRAB,
                  sprite: new Sprite(0, 0, require("../../resources/image/minigames/deadCrab.png"))
                })

                this._stoppedCrabs++;


                return true;
            }
        }

        return false;
    }

    breakSandCastle(x: number, y: number): boolean {

        let width: number = 32;

        for (let i = 0; i < this._items.length; i++) {

            if (this._items[i] == null || this._items[i].itemType != ItemType.SAND_CASTLE) {
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

    findItem(x: number, y: number): Direction {

        let closestItem: Item = null;
        let closestDistance: number = 90000;

        for (let i = 0; i < this._items.length; i++) {

            if (this._items[i] == null || this._items[i].itemType != ItemType.SAND_CASTLE) {
                continue;
            }

            let manhattanDistance: number = ((Math.abs(x - this._items[i].x) + Math.abs(y - this._items[i].y)) * 10);

            if (manhattanDistance < closestDistance) {
                closestDistance = manhattanDistance;
                closestItem = this._items[i];
            }

        }

        if (closestItem != null) {

            if (x < closestItem.x && x + 64 < closestItem.x) {
                return Direction.RIGHT;
            } else if (x > closestItem.x && x + 64 > closestItem.x) {
                return Direction.LEFT;
            } else if (y > closestItem.y) {
                return Direction.UP;
            } else if (y < closestItem.y) {
                return Direction.DOWN;
            }


        }

        return Direction.STAY_PUT;
    }

    logicLoop(): void {

        if (this._gameStage != GameStage.INSTRUCTIONS) {
            if (this._totalTime <= 0) {
                this._gameStage = GameStage.END;
                EventBus.publish(new ScreenChangeEvent("activity"));
            } else if (this._sandCastles == 0) {
                this._gameStage = GameStage.END;
                EventBus.publish(new ScreenChangeEvent("activity"));
            } else if (this._sandCastles > 0 && this._totalTime > 0) {
                this.gameLogic();
            }
        }




    }

    gameLogic() : void {
        if (Date.now() > this._timePassed + 1_000) {
            this._totalTime--;
            this._timePassed = Date.now();
        }

        if (Date.now() > this._lastWave + 2_000) {

            this._lastWave = Date.now();

            this._enemies.push({
                x: getRandomBetween(-50,900),
                y: getRandomBetween(-50,20),
                speed: 10,
                timePerMove: 128,
                lastMove: Date.now(),
                sprite: new Sprite(0,0, require("../../resources/image/minigames/crab.png"))
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

            let direction: Direction = this.findItem(enemy.x, enemy.y);

            switch (direction) {
                case Direction.UP:
                    if ((enemy.y - enemy.speed) > 0) {

                        enemy.y -= enemy.speed;

                        if (this.breakSandCastle(enemy.x, enemy.y - enemy.speed)) {
                            console.log("crushed");
                        }
                    }
                    break;
                case Direction.DOWN:
                    if ((enemy.y + enemy.speed) < 700) {

                        enemy.y += enemy.speed;

                        if (this.breakSandCastle(enemy.x, enemy.y + enemy.speed)) {
                            console.log("crushed");
                        }
                    }
                    break;
                case Direction.LEFT:
                    if ((enemy.x - enemy.speed) > 0) {

                        enemy.x -= enemy.speed;

                        if (this.breakSandCastle(enemy.x - enemy.speed, enemy.y)) {
                            console.log("crushed");
                        }
                    }
                    break;
                case Direction.RIGHT:
                    if ((enemy.x + enemy.speed) < 970) {

                        enemy.x += enemy.speed;

                        if (this.breakSandCastle(enemy.x + enemy.speed, enemy.y)) {
                            console.log("crushed");
                        }
                    }
                    break;
            }


        }
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    onEnter(): void {
        this._lastWave = Date.now();
        this._totalTime = 20;
        this._score = 0;
        this._timePassed = Date.now();
        this._sandCastles = 3;
        this._gameStage = GameStage.INSTRUCTIONS;

        this._enemies.push({
            x: getRandomBetween(-50, 900),
            y: getRandomBetween(-50, 20),
            speed: 6,
            timePerMove: 128,
            lastMove: Date.now(),
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/crab.png"))
        });


        this._items.push({
            x: getRandomBetween(50, 300),
            y: getRandomBetween(300, 700),
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/sandCastle.png")),
            itemType: ItemType.SAND_CASTLE
        });

        this._items.push({
            x: getRandomBetween(300, 600),
            y: getRandomBetween(300, 700),
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/sandCastle.png")),
            itemType: ItemType.SAND_CASTLE
        });

        this._items.push({
            x: getRandomBetween(600, 900),
            y: getRandomBetween(300, 700),
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/sandCastle.png")),
            itemType: ItemType.SAND_CASTLE
        });
    }

    onExit(): void {
    }

    renderLoop(): void {

        this.renderGame();

        if (this._gameStage == GameStage.INSTRUCTIONS) {

            let npc : Npc = NpcManager.getNpc(Vampy.calling);

            let dialogue : string = "Oh no, Vampy! Those crabs are going to destroy our sand castles!";
            let npcWidth: number = Renderer.calculateTextWidth(dialogue, "normal arial 20px")

            Renderer.rect(148, 298, 505, 105, new Color(0, 0, 0));
            Renderer.rect(150, 300, 500, 100, new Color(52, 189, 235));

            Renderer.print(dialogue, 180, 340, "Arial", 16, new Color(255,255,255));


            Renderer.rect(288, 448, 455, 205, new Color(0, 0, 0));
            Renderer.rect(290, 450, 450, 200, new Color(199, 58, 93));

            Renderer.print("I'll stop them! [press enter]", 300, 480, "Arial", 16, new Color(0, 0, 0));


            npc.face.renderConversation(-80, 350, 384);
            Vampy.render(680, 350, 384, 384);
        } else if (this._gameStage == GameStage.END) {



            /*
            let npc : Npc = NpcManager.getNpc(Vampy.calling);

            let dialogue : string = "Thanks Vampy! The remaining crabs are running away!";
            let npcWidth: number = Renderer.calculateTextWidth(dialogue, "normal arial 20px")

            Renderer.rect(148, 298, 505, 105, new Color(0, 0, 0));
            Renderer.rect(150, 300, 500, 100, new Color(52, 189, 235));

            Renderer.print(dialogue, 180, 340, "Arial", 16, new Color(255,255,255));


            Renderer.rect(288, 448, 455, 205, new Color(0, 0, 0));
            Renderer.rect(290, 450, 450, 200, new Color(199, 58, 93));

            Renderer.print("Friends help each other! [press enter]", 300, 480, "Arial", 16, new Color(0, 0, 0));


            npc.face.renderConversation(-80, 350, 384);
            Vampy.render(680, 350, 384, 384);

             */

        }

        Renderer.rect(0, 700, 1024, 70, new Color(0, 0, 0));

    }

    renderGame() : void {
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


        Renderer.renderImage(this._player[0].image, this._x, this._y, 64, 64);


        Renderer.print("Friend Score: " + this._score,100, 32, "Inconsolata, monospace", 16, new Color(255, 255, 255));


        Renderer.print("Time Remaining: " + this._totalTime + " seconds",400, 32, "Inconsolata, monospace", 16, new Color(255, 255, 255));


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

}
