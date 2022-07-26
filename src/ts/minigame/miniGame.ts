import {KeyboardInput, Renderer, Sprite} from "@alexayers/teenytinytwodee";

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

export abstract class MiniGame {

    abstract instruction(): void
    abstract renderGame(): void
    abstract gamePlayLogic(): void
    abstract initPlayer(): void
    abstract initGame(): void
    abstract loseState(): boolean
    abstract getTotalTime(): number;
    abstract playerTouchesEnemy(enemy: string, enemyIdx: number, x: number, y: number): void
    abstract playerTouchesItem(item: string, itemIdx: number, x: number, y: number): void

    protected _enemies: Array<Enemy> = [];
    protected _items: Array<Item> = [];
    protected _player : Player;

    renderEntities(): void {

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

                this.playerTouchesItem(this._items[i].objectType, i, x,y);
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

                this.playerTouchesEnemy(this._enemies[i].objectType, i, x,y);
                return true;
            }
        }

        return false;
    }

    gameControls(keyCode: number) : void {
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
}
