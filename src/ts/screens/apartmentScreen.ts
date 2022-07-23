import {
    Color,
    GameScreen,
    getRandomBetween,
    KeyboardInput,
    MouseButton,
    Renderer,
    ScreenChangeEvent
} from "@alexayers/teenytinytwodee";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {Vampire} from "../data/vampire";
import {Npc, NpcManager} from "../data/npc";
import {ConversationManager} from "../data/conversation";


export class ApartmentScreen implements GameScreen {

    private _openingNPCDialogue: string;
    private _openingVampDialogue: string;
    private _closingNPCDialogue: string;

    private _openingVampyPositiveDialogue: string;
    private _openingVampyNeutralDialogue: string;
    private _openingVampyNegativeDialogue: string;
    private _callOver: boolean = true;
    private _canDoActivity: boolean = false;
    private _npc:Npc;

    init(): void {
    }

    keyboard(keyCode: number): void {
        if (keyCode == KeyboardInput.A && this._canDoActivity) {
            EventBus.publish(new ScreenChangeEvent("activity"));
        } else if (keyCode == KeyboardInput.Y) {
            EventBus.publish(new ScreenChangeEvent("yearbook"));
        }

        if (Vampire.calling && !this._callOver) {
            if (keyCode == KeyboardInput.ONE) {
                this._closingNPCDialogue = ConversationManager.getNpcPositiveClosing();
                this._callOver = true;
                this._canDoActivity = true;
            } else if (keyCode == KeyboardInput.TWO) {
                if (getRandomBetween(1, 100) < 50) {
                    this._closingNPCDialogue = ConversationManager.getNpcPositiveClosing();
                    this._canDoActivity = true;
                } else {
                    this._closingNPCDialogue = ConversationManager.getNpcNegativeClosing();
                    this._canDoActivity = false;
                }

                this._callOver = true;
            } else if (keyCode == KeyboardInput.THREE) {
                this._closingNPCDialogue = ConversationManager.getNpcNegativeClosing();
                this._callOver = true;
                this._canDoActivity = false;
            }
        }

    }

    logicLoop(): void {
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    renderLoop(): void {

        Renderer.print("You at your apartment", 50,50, "Arial", 50, new Color(0,0,0));

        Renderer.print("Y: Look at yearbook", 50,100, "Arial", 50, new Color(0,0,0));

        if (Vampire.calling) {
            let offsetY : number= 200;

            Renderer.print("Vampy: " + this._openingVampDialogue, 50, offsetY, "Arial", 15, new Color(0,0,0));
            offsetY += 50;
            Renderer.print(this._npc.firstName + ": " + this._openingNPCDialogue, 50, offsetY, "Arial", 15, new Color(0,0,0));

            offsetY += 50;

            Renderer.print("Vampy Choices: ", 50, offsetY, "Arial", 15, new Color(0,0,0));
            offsetY += 50;

            Renderer.print("1. " + this._openingVampyPositiveDialogue, 50, offsetY, "Arial", 15, new Color(0,0,0));
            offsetY += 50;

            Renderer.print("2. " + this._openingVampyNeutralDialogue, 50, offsetY, "Arial", 15, new Color(0,0,0));
            offsetY += 50;

            Renderer.print("3. " + this._openingVampyNegativeDialogue, 50, offsetY, "Arial", 15, new Color(0,0,0));


            if (this._closingNPCDialogue) {

                offsetY += 100;

                Renderer.print(this._npc.firstName + ": " + this._closingNPCDialogue, 50, offsetY, "Arial", 15, new Color(0,0,0));

                offsetY += 50;

                if (this._canDoActivity) {
                    Renderer.print("Press A to go to activity", 50, offsetY, "Arial", 15, new Color(0,0,0));
                } else {
                    Renderer.print("Vampy: Hello.....?", 50, offsetY, "Arial", 15, new Color(0,0,0));
                }

            }

        }


    }

    onEnter(): void {
        if (Vampire.calling) {
            this._npc = NpcManager.getNpc(Vampire.calling);
            this._callOver = false;
            this._canDoActivity = false;

            this._openingVampDialogue = ConversationManager.getVampyOpeningLine();
            this._openingNPCDialogue = ConversationManager.getNpcOpeningPhoneLine();
            this._openingVampyPositiveDialogue = ConversationManager.getVampyPositiveOpeningPhoneLine();
            this._openingVampyNeutralDialogue = ConversationManager.getVampyNeutralOpeningPhoneLine();
            this._openingVampyNegativeDialogue = ConversationManager.getVampyNegativeOpeningPhoneLine();
        }
    }

    onExit(): void {
        this._closingNPCDialogue = "";
        this._openingNPCDialogue = "";
        this._openingVampyNegativeDialogue = "";
        this._openingVampyNeutralDialogue = "";
        this._openingVampyPositiveDialogue = "";
        this._canDoActivity = false;
    }


}
