import {
    Color,
    GameScreen,
    KeyboardInput,
    MouseButton, Renderer, ScreenChangeEvent,
} from "@alexayers/teenytinytwodee";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {BeachGame} from "./beachGame";
import {GameStage, MiniGame} from "./miniGame";
import {Npc, NpcManager} from "../data/npc";
import {Vampy} from "../data/vampy";




export class MiniGameScreen implements GameScreen {

    protected _gameStage: GameStage;
    protected _totalTime : number;
    protected _timePassed : number;
    private _miniGame: MiniGame;

    init(): void {
        this._miniGame = new BeachGame();
        this._miniGame.initGame();
    }

    keyboard(keyCode: number): void {
        if (this._gameStage == GameStage.PLAY) {
            this._miniGame.gameControls(keyCode);
        } else if (this._gameStage == GameStage.INSTRUCTIONS) {
            if (keyCode == KeyboardInput.ENTER) {
                this._gameStage = GameStage.PLAY;
            }
        } else if (this._gameStage == GameStage.END) {

        }
    }



    gameLogic() : void {
        if (Date.now() > this._timePassed + 1_000) {
            this._totalTime--;
            this._timePassed = Date.now();
        }

        this._miniGame.gamePlayLogic();
    }

    logicLoop(): void {
        if (this._gameStage != GameStage.INSTRUCTIONS) {
            if (this._totalTime <= 0) {
                this._gameStage = GameStage.END;
                EventBus.publish(new ScreenChangeEvent("activity"));
            } else if (this._miniGame.loseState()) {

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
        this._gameStage = GameStage.INSTRUCTIONS;
        this._totalTime = this._miniGame.getTotalTime();
    }

    onExit(): void {

    }

    renderLoop(): void {

        this._miniGame.renderGame();
        this._miniGame.renderEntities();

        if (this._gameStage == GameStage.INSTRUCTIONS) {
            this._miniGame.instruction();
        } else if (this._gameStage == GameStage.END) {

        }

        let npc : Npc = NpcManager.getNpc(Vampy.calling);

        Renderer.print("Friend Score: " + npc.friendShip, 100, 32, "Inconsolata, monospace", 16, new Color(255, 255, 255));
        Renderer.print("Exposure", 700, 32, "Inconsolata, monospace", 16, new Color(255, 255, 255));
        Renderer.rect(800, 20, 128, 16, new Color(255, 255, 255));

        Renderer.rect(0, 700, 1024, 70, new Color(0, 0, 0));
        Renderer.print("Time Remaining: " + this._totalTime + " seconds", 400, 740, "Inconsolata, monospace", 16, new Color(255, 255, 255));
    }



}
