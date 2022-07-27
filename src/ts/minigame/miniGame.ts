import {KeyboardInput, Renderer, Sprite} from "@alexayers/teenytinytwodee";

export interface BaseEntity {
    objectType: string
}

export interface Item extends BaseEntity {
    x: number
    y: number
    width: number
    height: number
    sprite: Sprite
    wall: boolean;
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
    findItem: string
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

    abstract enemyTouchesItem(item: string, itemIdx: number, x: number, y: number): void

    protected _enemies: Array<Enemy> = [];
    protected _items: Array<Item> = [];
    protected _player: Player;

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


        if (this._player != null && this._player.sprite != null) {
            Renderer.renderImage(this._player.sprite.image, this._player.x, this._player.y, 64, 64);
        }

    }

    enemyAi(): void {
        for (let i = 0; i < this._enemies.length; i++) {

            if (this._enemies[i] == null) {
                continue;
            }

            let enemy: Enemy = this._enemies[i];

            if (Date.now() < enemy.lastMove + enemy.timePerMove) {
                continue
            }

            enemy.lastMove = Date.now();

            let direction: {primary: Direction, secondary: Direction} = this.findItem(enemy.x, enemy.y, enemy.findItem);

            if (!this.movedLocation(enemy, i, direction.primary)) {
                this.movedLocation(enemy, i, direction.secondary);
            }


        }
    }

    movedLocation(enemy: Enemy, itemIdx :number, direction: Direction) : boolean {
        switch (direction) {
            case Direction.UP:
                if ((enemy.y - enemy.speed) > 0) {

                    if (!this.itemCollision(enemy.x, enemy.y - enemy.speed)) {
                        enemy.y -= enemy.speed;
                        this.enemyTouchesItem(this._items[itemIdx].objectType, itemIdx, enemy.x, enemy.y);
                        return true;
                    }
                }
                break;
            case Direction.DOWN:
                if ((enemy.y + enemy.speed) < 700) {

                    if (!this.itemCollision(enemy.x, enemy.y + enemy.speed)) {
                        enemy.y += enemy.speed;
                        this.enemyTouchesItem(this._items[itemIdx].objectType, itemIdx, enemy.x, enemy.y);
                        return true;
                    }
                }
                break;
            case Direction.LEFT:
                if ((enemy.x - enemy.speed) > 0) {
                    if (!this.itemCollision(enemy.x - enemy.speed, enemy.y)) {
                        enemy.x -= enemy.speed;
                        this.enemyTouchesItem(this._items[itemIdx].objectType, itemIdx, enemy.x, enemy.y);
                        return true;
                    }
                }
                break;
            case Direction.RIGHT:
                if ((enemy.x + enemy.speed) < 970) {

                    if (!this.itemCollision(enemy.x + enemy.speed, enemy.y)) {
                        enemy.x += enemy.speed;
                        this.enemyTouchesItem(this._items[itemIdx].objectType, itemIdx, enemy.x, enemy.y);
                        return true;
                    }
                }
                break;
        }
    }

    itemCollision(x: number, y: number): boolean {
        for (let i = 0; i < this._items.length; i++) {

            if (this._items[i] == null) {
                continue;
            }

            if (x < (this._items[i].x + this._items[i].width) &&
                (x + this._items[i].width) > this._items[i].x &&
                y < (this._items[i].y + this._items[i].width) &&
                (y + this._items[i].width) > this._items[i].y
            ) {

                if (!this._items[i].wall) {
                    this.playerTouchesItem(this._items[i].objectType, i, x, y);
                } else {
                    return true;
                }

            }
        }
    }

    collisionDetected(x: number, y: number): boolean {
        let width: number = 32;


        if (this.itemCollision(x, y)) {
            return true;
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

                this.playerTouchesEnemy(this._enemies[i].objectType, i, x, y);
                return true;
            }
        }

        return false;
    }

    gameControls(keyCode: number): void {
        if (keyCode == KeyboardInput.UP) {
            if ((this._player.y - this._player.speed) > 0) {

                if (!this.collisionDetected(this._player.x, this._player.y - this._player.speed)) {
                    this._player.y -= this._player.speed;
                }

            }
        } else if (keyCode == KeyboardInput.DOWN) {
            if ((this._player.y + this._player.speed) < 640) {

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

    findItem(x: number, y: number, item: string): {primary: Direction, secondary: Direction} {

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
            let primary : Direction;
            let secondary : Direction;

            if (x < closestItem.x && x + 64 < closestItem.x) {
                primary = Direction.RIGHT;
               // return Direction.RIGHT;
            }

            if (x > closestItem.x && x + 64 > closestItem.x) {
                primary = Direction.LEFT;
               // return Direction.LEFT;
            }

            if (y > closestItem.y) {
                secondary = Direction.UP;
              //  return Direction.UP;
            }


            if (y < closestItem.y) {
                secondary = Direction.DOWN;
             //   return Direction.DOWN;
            }

            return {
                primary: primary,
                secondary: secondary
            }
        }

        return {primary: Direction.STAY_PUT, secondary: Direction.STAY_PUT}
    }
}
