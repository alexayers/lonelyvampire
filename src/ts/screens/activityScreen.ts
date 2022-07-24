import {
    Color,
    GameScreen, getRandomBetween,
    KeyboardInput,
    logger,
    LogType,
    MouseButton,
    Renderer,
    ScreenChangeEvent
} from "@alexayers/teenytinytwodee";
import {Vampire} from "../data/vampire";
import {Npc, NpcManager} from "../data/npc";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {Activity, ActivityManager} from "../data/activityManager";
import {ActivityConversationManager} from "../data/conversation";

export enum ConversationFlow {
    VAMPY_GREETING,
    VAMPY_FIRST_CHOICE,
    VAMPY_COMMITMENT,
    INTERSTITIAL,
    VAMPY_FINAL_CHOICE,
    CONVERSATION_OVER

}

export enum VampyChoice {
    GOOD,
    BAD,
    NEUTRAL
}

export class ActivityScreen implements GameScreen {

    private _color: Color;

    private _conversationFlow : ConversationFlow;
    private _showChoice: boolean;

    private _npcDialogue : string = "";
    private _vampyDialogue : string = ";"
    private _npc: Npc;
    private _activity: Activity;

    private _conversationTick : number = 0;
    private _conversationSpeed : number = 1;
    private _word : number = 0;
    private _dialogue : string = "";
    private _npcTokens : Array<string> = [];

    private _vampyChoice : VampyChoice;
    private _vampyChoices: Array<string> = [];

    private _vampyGreeting: boolean = false;


    init(): void {
        this._color = new Color(0,0,0);


        Vampire.calling = NpcManager._npcs[0].id;
        this._conversationFlow = ConversationFlow.VAMPY_GREETING;
    }

    onEnter(): void {

        this._npcDialogue = "";
        this._vampyDialogue = "";

        this._showChoice = false;
        this._npc = NpcManager.getNpc(Vampire.calling);

        let activityName = this._npc.favoriteActivity;
        this._activity = ActivityManager.getActivity(activityName);

        this._npcDialogue = ActivityConversationManager.getNpcGreetingLine();

        this._npcTokens = this._dialogue.split(" ");
        this._word = 0;
        this._vampyChoices = [];

    }

    onExit(): void {

    }

    keyboard(keyCode: number): void {

        if (keyCode == KeyboardInput.H) {
            EventBus.publish(new ScreenChangeEvent("apartment"));
        } else if (keyCode == KeyboardInput.ENTER) {
            switch (this._conversationFlow) {
                case ConversationFlow.VAMPY_GREETING:
                    this._vampyDialogue = ActivityConversationManager.getVampyGreeting();
                    this._conversationFlow = ConversationFlow.VAMPY_FIRST_CHOICE;
                    break;
                case ConversationFlow.VAMPY_FIRST_CHOICE:

                    let good : string = "A.) " + ActivityConversationManager.getVampyFirstResponsePositive();
                    let neutral : string = "B.) " + ActivityConversationManager.getVampyFirstResponseNeutral();
                    let negative : string = "C.) " + ActivityConversationManager.getVampyFirstResponseNegative();

                    this._vampyChoices.push(good);
                    this._vampyChoices.push(neutral);
                    this._vampyChoices.push(negative);

                    this._showChoice = true;
                    break;
                case ConversationFlow.VAMPY_COMMITMENT:

                    let commitToActivity : string = "A.) " + ActivityConversationManager.getVampyCommitmentPositive();
                    let rejectActivity : string = "C.) " + ActivityConversationManager.getVampyCommitmentNegative();

                    this._vampyChoices.push(commitToActivity);
                    this._vampyChoices.push(rejectActivity);

                    this._showChoice = true;
                    break;
                case ConversationFlow.INTERSTITIAL:
                    this._npcDialogue = ActivityConversationManager.getNpcFinalPrompt();
                    this._conversationFlow = ConversationFlow.VAMPY_FINAL_CHOICE;
                    break;
                case ConversationFlow.VAMPY_FINAL_CHOICE:
                    let finalChoiceGood : string = "A.) " + ActivityConversationManager.getVampyFinalChoicePositive();
                    let finalChoiceNeutral : string = "B.) " + ActivityConversationManager.getVampyFinalChoiceNeutral();
                    let finalChoiceBad : string = "C.) " + ActivityConversationManager.getVampyFinalChoiceNegatve();

                    this._vampyChoices.push(finalChoiceGood);
                    this._vampyChoices.push(finalChoiceNeutral);
                    this._vampyChoices.push(finalChoiceBad);

                    this._showChoice = true;
                    break
            }
        }

        if (this._showChoice) {
            if (keyCode == KeyboardInput.A) {
                this._vampyChoice = VampyChoice.GOOD;
                this._showChoice = false;
                this._vampyChoices = [];
                this._vampyDialogue = "";

                if (this._conversationFlow == ConversationFlow.VAMPY_FIRST_CHOICE) {
                    this._npcDialogue = ActivityConversationManager.getNpcSecondResponsePositive();
                    this._conversationFlow = ConversationFlow.VAMPY_COMMITMENT;
                } else if (this._conversationFlow == ConversationFlow.VAMPY_COMMITMENT) {
                    this._showChoice = false;
                    this._vampyChoices = [];
                    this._vampyDialogue = "";
                    this._conversationFlow = ConversationFlow.INTERSTITIAL;
                    this._npcDialogue = ActivityConversationManager.getRandomIntermission();
                } else if (this._conversationFlow == ConversationFlow.VAMPY_FINAL_CHOICE) {
                    this._npcDialogue = ActivityConversationManager.getNpcFinalReplyGood();
                    this._conversationFlow = ConversationFlow.CONVERSATION_OVER;
                }

            } else if (keyCode == KeyboardInput.B) {
                this._vampyChoice = VampyChoice.NEUTRAL;
                this._showChoice = false;
                this._vampyChoices = [];
                this._vampyDialogue = "";
                if (this._conversationFlow == ConversationFlow.VAMPY_FIRST_CHOICE) {
                    this._npcDialogue = ActivityConversationManager.getNpcSecondResponseNeutral();
                    this._conversationFlow = ConversationFlow.VAMPY_COMMITMENT;
                } else if (this._conversationFlow == ConversationFlow.VAMPY_FINAL_CHOICE) {

                    if (getRandomBetween(1,100) < 50) {
                        this._npcDialogue = ActivityConversationManager.getNpcFinalReplyGood();
                    } else {
                        this._npcDialogue = ActivityConversationManager.getNpcFinalReplyNegative();
                    }

                    this._conversationFlow = ConversationFlow.CONVERSATION_OVER;
                }
            } else if (keyCode == KeyboardInput.C) {
                this._vampyChoice = VampyChoice.BAD;
                this._showChoice = false;
                this._vampyChoices = [];
                this._vampyDialogue = "";
                if (this._conversationFlow == ConversationFlow.VAMPY_FIRST_CHOICE) {
                    this._npcDialogue = ActivityConversationManager.getNpcSecondResponseNegative();
                    this._conversationFlow = ConversationFlow.VAMPY_COMMITMENT;
                } else if (this._conversationFlow == ConversationFlow.VAMPY_COMMITMENT) {
                    EventBus.publish(new ScreenChangeEvent("apartment"));
                } else if (this._conversationFlow == ConversationFlow.VAMPY_FINAL_CHOICE) {
                    this._npcDialogue = ActivityConversationManager.getNpcFinalReplyNegative();
                    this._conversationFlow = ConversationFlow.CONVERSATION_OVER;
                }
            }
        }
    }

    logicLoop(): void {

        this._conversationTick++;

        if (this._conversationTick == this._conversationSpeed) {
            this._conversationTick = 0;

            if (this._word < this._npcTokens.length) {
                this._word++;
            }
        }


    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    renderLoop(): void {
        Renderer.rect(0,0, 1024,768, this._activity.backgroundColor);
        Renderer.rect(740,350, 256,410, new Color(0,0,0));

        Renderer.print("Press [enter] to talk or [A,B, or C] when making choice", 250, 50, "Arial", 16, new Color(0,0,0));


       this.renderDialogue();

        /*
        let offsetX : number = 100;
        for (let i = 0; i < this._word; i++) {
            Renderer.print(this._npcTokens[i] , offsetX, 200, "Arial", 12, new Color(0,0,0));
            offsetX += Renderer.calculateTextWidth(this._npcTokens[i] + " ", "normal 12px arial");
        }*/



    //    this._npc.face.renderConversation(-80,250, 512);
        Renderer.rect(0, 700, 1024, 70, new Color(0,0,0));
    }

    renderDialogue() : void {
        Renderer.print(this._npcDialogue, 100, 200, "Arial", 12, new Color(0,0,0));

        if (this._vampyDialogue != "") {
            Renderer.print(this._vampyDialogue, 100, 220, "Arial", 12, new Color(0,0,0));
        }

        if (this._showChoice) {

            let offsetY : number = 250;

            for (let i = 0; i < this._vampyChoices.length; i++) {
                Renderer.print(this._vampyChoices[i], 100, offsetY, "Arial", 12, new Color(0,0,0));

                offsetY += 30;
            }

        }


    }

}
