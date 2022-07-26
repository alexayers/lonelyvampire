import {
    GameScreen,
    KeyboardInput,
    MouseButton, ScreenChangeEvent,
    Sprite
} from "@alexayers/teenytinytwodee";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";

export interface BaseEntity {
    objectType: string
}

export interface Item extends BaseEntity {
    x: number
    y: number
    sprite: Sprite
}

export interface Player {
    x: number
    y: number
    speed: number
    sprite: Sprite
}

export interface Enemy extends BaseEntity {
    x: number
    y: number
    timePerMove: number
    speed: number
    sprite: Sprite
    lastMove: number
}

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    STAY_PUT
}

export enum GameStage {
    INSTRUCTIONS,
    PLAY,
    END
}

export interface MiniGame {
    instruction(): void;
    renderGame(): void;
    gamePlayLogic(): void;
    initPlayer(): void;
    initGame(): void;
}

export abstract class MiniGameScreen implements GameScreen {


    protected _enemies: Array<Enemy> = [];
    protected _items: Array<Item> = [];
    protected _player : Player;
    protected _objectCollision: Map<string, Function> = new Map<string, Function>();

    protected _enemyCollision: Map<string, Map<string,Function>> = new Map<string, Map<string,Function>>();

    protected _totalTime : number;
    protected _timePassed : number;
    protected _gameStage: GameStage;
    protected _score: number;

    private _loseFunction: Function;
    private _gameContinue: Function;
    private _gamePlayLogic: Function;

    init(): void {

    }

    keyboard(keyCode: number): void {
        if (this._gameStage == GameStage.PLAY) {
            this.gameControls(keyCode);
        } else if (this._gameStage == GameStage.INSTRUCTIONS) {
            if (keyCode == KeyboardInput.ENTER) {
                this._gameStage = GameStage.PLAY;
            }
        } else if (this._gameStage == GameStage.END) {

        }
    }


    protected gameControls(keyCode: number) : void {
        if (keyCode == KeyboardInput.UP) {
            if ((this._player.y - this._player.speed) > 0) {

                if (!this.collisionDetected(this._player.x, this._player.y - this._player.speed)) {
                    this._player.y -= this._player.speed;
                }

            }
        } else if (keyCode == KeyboardInput.DOWN) {
            if ((this._player.y + this._player.speed) < 700) {

                if (!this.collisionDetected(this._player.x, this._player.y + this._player.speed)) {
                    this._player.y += this._player.speed;
                }
            }
        } else if (keyCode == KeyboardInput.LEFT) {
            if ((this._player.x - this._player.speed) > 0) {
                if (!this.collisionDetected(this._player.x - this._player.speed, this._player.y)) {
                    this._player.x -= this._player.speed;
                }

            }
        } else if (keyCode == KeyboardInput.RIGHT) {
            if ((this._player.x + this._player.speed) < 970) {

                if (!this.collisionDetected(this._player.x + this._player.speed, this._player.y)) {
                    this._player.x += this._player.speed;
                }
            }
        }
    }

    playerCollisionHandler(objectType: string, func : Function) : void {
        this._objectCollision.set(objectType, func);
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

                if (this._objectCollision.has(this._items[i].objectType)) {
                    this._objectCollision.get(this._items[i].objectType)();
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

                if (this._objectCollision.has(this._enemies[i].objectType)) {
                    this._objectCollision.get(this._enemies[i].objectType)(i,x,y);
                }


                return true;
            }
        }

        return false;
    }

    findItem(x: number, y: number, item: string): Direction {

        let closestItem: Item = null;
        let closestDistance: number = 90000;

        for (let i = 0; i < this._items.length; i++) {

            if (this._items[i] == null || this._items[i].objectType != item) {
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

    gameLogic() : void {
        if (Date.now() > this._timePassed + 1_000) {
            this._totalTime--;
            this._timePassed = Date.now();
        }

        this._gamePlayLogic();
    }

    setLooseState(func: Function) : void {
        this._loseFunction = func;
    }

    setGameContinue(func: Function) : void {
        this._gameContinue = func;
    }

    setGamePlayLogic(func: Function) : void {
        this._gamePlayLogic = func;
    }

    logicLoop(): void {
        if (this._gameStage != GameStage.INSTRUCTIONS) {
            if (this._totalTime <= 0) {
                this._gameStage = GameStage.END;
                EventBus.publish(new ScreenChangeEvent("activity"));
            } else if (this._loseFunction()) {

            } else {
                this.gameLogic();
            }
        }
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    onEnter(): void {
        this._timePassed = Date.now();
        this._score = 0;
        this._gameStage = GameStage.INSTRUCTIONS;
    }

    onExit(): void {
        throw new Error("Method not implemented.");
    }

    renderLoop(): void {
        throw new Error("Method not implemented.");
    }



}
