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
import {Npc, NpcManager} from "../data/npc";
import {PhoneConversationManager} from "../data/conversation";
import {Vampire} from "../data/vampire";

export enum ConversationFlow {
   VAMPY_OPENING,
    NPC_REPLY,
    VAMPY_CHOICE,
    NPC_FINAL,
    HANG_UP,
    GOTO_ACTIVITY
}

export class PhoneCallScreen implements GameScreen {

    private _vampyDialogue: string;
    private _vampyChoices: Array<string> = [];
    private _conversationFlow: ConversationFlow;

    private _canDoActivity: boolean = false;
    private _npc: Npc;

    private _backgroundColor: Color;

    private _conversationDelay : number;
    private _npcDialogue: string;
    private _showChoice: boolean = false;

    init(): void {
        this._backgroundColor = new Color(56, 56, 56);
    }

    keyboard(keyCode: number): void {
        if (keyCode == KeyboardInput.A && this._canDoActivity) {
            EventBus.publish(new ScreenChangeEvent("activity"));
        } else if (keyCode == KeyboardInput.Y) {
            EventBus.publish(new ScreenChangeEvent("yearbook"));
        }


        if (this._showChoice) {
            if (keyCode == KeyboardInput.A) {
                this._showChoice = false;
                this._canDoActivity = true;
                this._vampyDialogue = "";
                this._vampyChoices = [];
            } else if (keyCode == KeyboardInput.B) {
                this._showChoice = false;
                this._vampyChoices = [];
                this._vampyDialogue = "";

                if (getRandomBetween(1,100) < 50) {
                    this._canDoActivity = true;
                } else {
                    this._canDoActivity = false;
                }

            } else if (keyCode == KeyboardInput.C) {
                this._vampyChoices = [];
                this._showChoice = false;
                this._canDoActivity = false;
                this._vampyDialogue = "";
            }
        }

    }

    logicLoop(): void {
        if (Date.now() > this._conversationDelay + 1200 && !this._showChoice) {

            this._conversationDelay = Date.now();

            switch (this._conversationFlow) {
                case ConversationFlow.VAMPY_OPENING:
                    this._vampyDialogue = PhoneConversationManager.getVampyOpeningPhoneLine();
                    this._conversationFlow = ConversationFlow.NPC_REPLY;
                    break;
                case ConversationFlow.NPC_REPLY:
                    this._npcDialogue = PhoneConversationManager.getNpcOpeningPhoneLine();
                    this._conversationFlow = ConversationFlow.VAMPY_CHOICE;
                    break;
                case ConversationFlow.VAMPY_CHOICE:
                    this._vampyChoices.push("A) " + PhoneConversationManager.getVampyPositiveOpeningPhoneLine());
                    this._vampyChoices.push("B) " + PhoneConversationManager.getVampyNeutralOpeningPhoneLine());
                    this._vampyChoices.push("C) " + PhoneConversationManager.getVampyNegativeOpeningPhoneLine());
                    this._showChoice = true;
                    this._conversationFlow = ConversationFlow.NPC_FINAL;
                    break;
                case ConversationFlow.NPC_FINAL:

                    if (this._canDoActivity) {
                        this._npcDialogue = PhoneConversationManager.getNpcPositivePhoneClosing();
                        this._conversationFlow = ConversationFlow.GOTO_ACTIVITY;
                    } else {
                        this._npcDialogue = PhoneConversationManager.getNpcNegativePhoneClosing();
                        this._conversationFlow = ConversationFlow.HANG_UP;
                    }

                    break;
                case ConversationFlow.GOTO_ACTIVITY:
                    EventBus.publish(new ScreenChangeEvent("activity"));
                    break;
                case ConversationFlow.HANG_UP:
                    EventBus.publish(new ScreenChangeEvent("apartment"));
                    break;
            }
        }
    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    renderLoop(): void {
        Renderer.rect(0, 0, 1024, 768, this._backgroundColor);
        Renderer.print("On the phone", 50, 50, "Arial", 50, new Color(0, 0, 0));


        this.renderDialogue();


        this._npc.face.renderConversation(-80, 350, 384);
        this._npc.face.renderConversation(680, 350, 384);


        Renderer.rect(0, 700, 1024, 70, new Color(0, 0, 0));

    }

    private wordWrap(text: string, x: number, y: number, width: number, height: number): void {

        Renderer.print(text, x, y, "Arial", 12, new Color(0, 0, 0));
    }

    private renderDialogue(): void {

        let npcWidth: number = Renderer.calculateTextWidth(this._npcDialogue, "normal arial 12px")

        if (this._npcDialogue != "") {
            Renderer.rect(148, 298, npcWidth * 1.5 + 5, 105, new Color(0, 0, 0));
            Renderer.rect(150, 300, npcWidth * 1.5, 100, new Color(52, 189, 235));

            this.wordWrap(this._npcDialogue, 180, 340, 400, 300);
        }


        if (this._vampyDialogue != "") {

            Renderer.rect(288, 448, 455, 205, new Color(0, 0, 0));
            Renderer.rect(290, 450, 450, 200, new Color(199, 58, 93));

            Renderer.print(this._vampyDialogue, 300, 480, "Arial", 12, new Color(0, 0, 0));
        }

        if (this._showChoice) {

            if (this._vampyDialogue == "") {
                Renderer.rect(288, 448, 455, 205, new Color(0, 0, 0));
                Renderer.rect(290, 450, 450, 200, new Color(199, 58, 93));
            }


            let offsetY: number = 530;

            for (let i = 0; i < this._vampyChoices.length; i++) {
                Renderer.print(this._vampyChoices[i], 300, offsetY, "Arial", 12, new Color(0, 0, 0));

                offsetY += 30;
            }

        }


    }

    onEnter(): void {
        this._vampyChoices = [];
        this._vampyDialogue = "";
        this._npcDialogue = "";
        this._showChoice = false;
        this._npc = NpcManager.getNpc(Vampire.calling);
        this._conversationDelay = Date.now();
        this._conversationFlow = ConversationFlow.VAMPY_OPENING;
    }

    onExit(): void {

    }


}
