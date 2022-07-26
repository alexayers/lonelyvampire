import {MiniGame, Player} from "./miniGame";


export class ArcadeGame extends MiniGame {

    gamePlayLogic(): void {
    }

    getTotalTime(): number {
        return 0;
    }

    initGame(): void {
    }

    initPlayer(): void {
    }

    instruction(): void {
    }

    loseState(): boolean {
        return false;
    }

    playerTouchesEnemy(enemy: string, enemyIdx: number, x: number, y: number): void {
    }

    playerTouchesItem(item: string, itemIdx: number, x: number, y: number): void {
    }

    renderGame(): void {
    }

}
