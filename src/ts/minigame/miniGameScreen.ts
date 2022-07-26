import {
    Color,
    GameScreen,
    KeyboardInput,
    MouseButton, Renderer, ScreenChangeEvent,
} from "@alexayers/teenytinytwodee";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {BeachGame} from "./beachGame";
import {GameStage, MiniGame} from "./miniGame";




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
            if ((this._miniGame.getPlayer().y - this._miniGame.getPlayer().speed) > 0) {

                if (!this._miniGame.collisionDetected(this._miniGame.getPlayer().x, this._miniGame.getPlayer().y - this._miniGame.getPlayer().speed)) {
                    this._miniGame.getPlayer().y -= this._miniGame.getPlayer().speed;
                }

            }
        } else if (keyCode == KeyboardInput.DOWN) {
            if ((this._miniGame.getPlayer().y + this._miniGame.getPlayer().speed) < 700) {

                if (!this._miniGame.collisionDetected(this._miniGame.getPlayer().x, this._miniGame.getPlayer().y + this._miniGame.getPlayer().speed)) {
                    this._miniGame.getPlayer().y += this._miniGame.getPlayer().speed;
                }
            }
        } else if (keyCode == KeyboardInput.LEFT) {
            if ((this._miniGame.getPlayer().x - this._miniGame.getPlayer().speed) > 0) {
                if (!this._miniGame.collisionDetected(this._miniGame.getPlayer().x - this._miniGame.getPlayer().speed, this._miniGame.getPlayer().y)) {
                    this._miniGame.getPlayer().x -= this._miniGame.getPlayer().speed;
                }

            }
        } else if (keyCode == KeyboardInput.RIGHT) {
            if ((this._miniGame.getPlayer().x + this._miniGame.getPlayer().speed) < 970) {

                if (!this._miniGame.collisionDetected(this._miniGame.getPlayer().x + this._miniGame.getPlayer().speed, this._miniGame.getPlayer().y)) {
                    this._miniGame.getPlayer().x += this._miniGame.getPlayer().speed;
                }
            }
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

        if (this._gameStage == GameStage.INSTRUCTIONS) {
            this._miniGame.instruction();
        } else if (this._gameStage == GameStage.END) {

        }

        Renderer.rect(0, 700, 1024, 70, new Color(0, 0, 0));
    }



}
