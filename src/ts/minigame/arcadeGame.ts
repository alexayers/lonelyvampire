import {MiniGame, Player} from "./miniGame";
import {Color, getRandomBetween, Renderer, Sprite} from "@alexayers/teenytinytwodee";


export class ArcadeGame extends MiniGame {

    gamePlayLogic(): void {
    }

    getTotalTime(): number {
        return 20;
    }

    initGame(): void {

        this.initPlayer();

        let offsetX : number = 50;
        let offsetY : number = 50;

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 7; x++) {
                this._items.push({
                    x: offsetX,
                    y: offsetY,
                    sprite: new Sprite(0, 0, require("../../resources/image/minigames/arcadeMachine.png")),
                    objectType: "arcadeMachine",
                    wall: true,
                    width: 32,
                    height: 32
                });

                offsetX += 96;
            }

            offsetX = 50
            offsetY += 96;
        }
    }

    initPlayer(): void {
        this._player = {
            speed: 16,
            sprite: new Sprite(0, 0, require("../../resources/image/minigames/player1.png")),
            x: 500,
            y: 520
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
