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
import {PhoneConversationManager} from "../data/conversation";


export class PhoneCallScreen implements GameScreen {

    private _openingNPCDialogue: string;
    private _openingVampDialogue: string;
    private _closingNPCDialogue: string;

    private _openingVampyPositiveDialogue: string;
    private _openingVampyNeutralDialogue: string;
    private _openingVampyNegativeDialogue: string;
    private _callOver: boolean = true;
    private _canDoActivity: boolean = false;
    private _npc: Npc;

    private _backgroundColor: Color;

    init(): void {
        this._backgroundColor = new Color(56, 56, 56);
    }

    keyboard(keyCode: number): void {
        if (keyCode == KeyboardInput.A && this._canDoActivity) {
            EventBus.publish(new ScreenChangeEvent("activity"));
        } else if (keyCode == KeyboardInput.Y) {
            EventBus.publish(new ScreenChangeEvent("yearbook"));
        }

        if (Vampire.calling && !this._callOver) {
            if (keyCode == KeyboardInput.ONE) {
                this._closingNPCDialogue = PhoneConversationManager.getNpcPositivePhoneClosing();
                this._callOver = true;
                this._canDoActivity = true;
            } else if (keyCode == KeyboardInput.TWO) {
                if (getRandomBetween(1, 100) < 50) {
                    this._closingNPCDialogue = PhoneConversationManager.getNpcPositivePhoneClosing();
                    this._canDoActivity = true;
                } else {
                    this._closingNPCDialogue = PhoneConversationManager.getNpcNegativePhoneClosing();
                    this._canDoActivity = false;
                    this._npc.friendShip--;
                }

                this._callOver = true;
            } else if (keyCode == KeyboardInput.THREE) {
                this._closingNPCDialogue = PhoneConversationManager.getNpcNegativePhoneClosing();
                this._callOver = true;
                this._canDoActivity = false;
                this._npc.friendShip--;
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
        Renderer.rect(0, 0, 1024, 768, this._backgroundColor);
        Renderer.print("On the phone", 50, 50, "Arial", 50, new Color(0, 0, 0));


        let offsetY: number = 200;


        Renderer.print("Vampy: " + this._openingVampDialogue, 50, offsetY, "Arial", 15, new Color(0, 0, 0));
        offsetY += 50;
        Renderer.print(this._npc.firstName + ": " + this._openingNPCDialogue, 50, offsetY, "Arial", 15, new Color(0, 0, 0));

        offsetY += 50;

        Renderer.print("Vampy Choices: ", 50, offsetY, "Arial", 15, new Color(0, 0, 0));
        offsetY += 50;

        Renderer.print("1. " + this._openingVampyPositiveDialogue, 50, offsetY, "Arial", 15, new Color(0, 0, 0));
        offsetY += 50;

        Renderer.print("2. " + this._openingVampyNeutralDialogue, 50, offsetY, "Arial", 15, new Color(0, 0, 0));
        offsetY += 50;

        Renderer.print("3. " + this._openingVampyNegativeDialogue, 50, offsetY, "Arial", 15, new Color(0, 0, 0));


        if (this._closingNPCDialogue) {

            offsetY += 100;

            Renderer.print(this._npc.firstName + ": " + this._closingNPCDialogue, 50, offsetY, "Arial", 15, new Color(0, 0, 0));

            offsetY += 50;

            if (this._canDoActivity) {
                Renderer.print("Press A to go to activity", 50, offsetY, "Arial", 15, new Color(0, 0, 0));
            } else {
                Renderer.print("Vampy: Hello.....?", 50, offsetY, "Arial", 15, new Color(0, 0, 0));
            }

        }

        this._npc.face.renderConversation(40, 250, 512);


        Renderer.rect(0, 700, 1024, 70, new Color(0, 0, 0));

    }

    onEnter(): void {
        if (Vampire.calling) {
            this._npc = NpcManager.getNpc(Vampire.calling);
            this._callOver = false;
            this._canDoActivity = false;

            this._openingVampDialogue = PhoneConversationManager.getVampyOpeningPhoneLine();
            this._openingNPCDialogue = PhoneConversationManager.getNpcOpeningPhoneLine();
            this._openingVampyPositiveDialogue = PhoneConversationManager.getVampyPositiveOpeningPhoneLine();
            this._openingVampyNeutralDialogue = PhoneConversationManager.getVampyNeutralOpeningPhoneLine();
            this._openingVampyNegativeDialogue = PhoneConversationManager.getVampyNegativeOpeningPhoneLine();
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
