import {
    Color,
    GameScreen,
    getRandomArrayElement,
    getRandomBetween,
    KeyboardInput,
    MouseButton,
    Renderer,
    ScreenChangeEvent
} from "@alexayers/teenytinytwodee";
import {Vampire} from "../data/vampire";
import {Npc, NpcManager} from "../data/npc";
import {EventBus} from "@alexayers/teenytinytwodee/dist/ts/lib/event/eventBus";
import {Activity, ActivityManager} from "../data/activityManager";
import {ActivityConversationManager} from "../data/conversation";
import arrayShuffle from "array-shuffle";

export enum ConversationFlow {
    VAMPY_GREETING,
    VAMPY_FIRST_CHOICE,
    VAMPY_COMMITMENT,
    MINI_GAME,
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

    private _conversationFlow: ConversationFlow;
    private _showChoice: boolean;

    private _npcDialogue: string = "";
    private _vampyDialogue: string = ";"
    private _npc: Npc;
    private _activity: Activity;

    private _conversationTick: number = 0;
    private _conversationSpeed: number = 1;
    private _word: number = 0;
    private _dialogue: string = "";
    private _npcTokens: Array<string> = [];

    private _vampyChoice: VampyChoice;
    private _vampyChoices: Array<string> = [];

    private _emojis: Array<string> = [];

    private _delay: number;

    private _points: number = 0;
    private _currentQuestion: number = 0;
    private _maxQuestions: number = 5;

    private _conversationDelay : number;

    init(): void {
        this._color = new Color(0, 0, 0);


        Vampire.calling = NpcManager._npcs[0].id;
        this._conversationFlow = ConversationFlow.VAMPY_GREETING;

        this._emojis.push("🐶");
        this._emojis.push("🐥");
        this._emojis.push("🐱");
        this._emojis.push("🍔");
        this._emojis.push("🌮");
        this._emojis.push("🍱");
        this._emojis.push("🎹");
        this._emojis.push("🎮");
        this._emojis.push("🎫");
        this._emojis.push("🏖");
        this._emojis.push("🏕");
        this._emojis.push("🏟");
        this._emojis.push("🪴");
        this._emojis.push("☃️");
        this._emojis.push("⚽️");
        this._emojis.push("🛹");

    }

    onEnter(): void {
        this._delay = Date.now();
        this._points = 0;
        this._currentQuestion;
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

        this._conversationDelay = Date.now();
    }

    onExit(): void {

    }

    calculateExposure(): void {
        switch (this._activity.exposure) {
            case "L":
                Vampire.exposure += 1;
                break;
            case "M":
                Vampire.exposure += 2;
                break;
            case "H":
                Vampire.exposure += 3;
                break;
        }
    }

    keyboard(keyCode: number): void {
        if (this._conversationFlow == ConversationFlow.MINI_GAME) {
            this.miniGameKeyboard(keyCode);
        } else {
            this.conversationKeyboard(keyCode);
        }

    }

    miniGameKeyboard(keyCode: number): void {
        if (keyCode == KeyboardInput.ONE) {
            if (this._npcDialogue == this._vampyChoices[0]) {
                this._points++;
            }
        } else if (keyCode == KeyboardInput.TWO) {
            if (this._npcDialogue == this._vampyChoices[1]) {
                this._points++;
            }
        } else if (keyCode == KeyboardInput.THREE) {
            if (this._npcDialogue == this._vampyChoices[2]) {
                this._points++;
            }
        } else if (keyCode == KeyboardInput.FOUR) {
            if (this._npcDialogue == this._vampyChoices[3]) {
                this._points++;
            }
        }
    }

    conversationKeyboard(keyCode: number): void {
        if (keyCode == KeyboardInput.H) {
            EventBus.publish(new ScreenChangeEvent("apartment"));
        }

        if (this._showChoice) {
            if (keyCode == KeyboardInput.A) {
                this.calculateExposure();
                this._conversationDelay = Date.now();
                this._points++;
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
                    this._npcDialogue = "get ready...";
                    this._conversationFlow = ConversationFlow.MINI_GAME;
                    this._delay = Date.now();
                } else if (this._conversationFlow == ConversationFlow.VAMPY_FINAL_CHOICE) {
                    this._npcDialogue = ActivityConversationManager.getNpcFinalReplyGood();
                    this._conversationFlow = ConversationFlow.CONVERSATION_OVER;
                }

            } else if (keyCode == KeyboardInput.B) {
                this._conversationDelay = Date.now();
                this.calculateExposure();

                this._vampyChoice = VampyChoice.NEUTRAL;
                this._showChoice = false;
                this._vampyChoices = [];
                this._vampyDialogue = "";
                if (this._conversationFlow == ConversationFlow.VAMPY_FIRST_CHOICE) {
                    this._npcDialogue = ActivityConversationManager.getNpcSecondResponseNeutral();
                    this._conversationFlow = ConversationFlow.VAMPY_COMMITMENT;
                } else if (this._conversationFlow == ConversationFlow.VAMPY_FINAL_CHOICE) {

                    if (getRandomBetween(1, 100) < 50) {
                        this._npcDialogue = ActivityConversationManager.getNpcFinalReplyGood();
                    } else {
                        this._npcDialogue = ActivityConversationManager.getNpcFinalReplyNegative();
                    }

                    this._conversationFlow = ConversationFlow.CONVERSATION_OVER;
                }
            } else if (keyCode == KeyboardInput.C) {
                this._conversationDelay = Date.now();
                this.calculateExposure();
                this._points--;
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

        if (this._conversationFlow == ConversationFlow.MINI_GAME) {

            if (Date.now() > this._delay + 1500) {
                let randIdx: number = getRandomArrayElement(this._emojis);
                this._npcDialogue = this._emojis[randIdx];
                this._vampyChoices = [];

                this._vampyChoices.push(this._emojis[randIdx]);

                for (let i = 0; i < 3; i++) {
                    randIdx = getRandomArrayElement(this._emojis);
                    this._vampyChoices.push(this._emojis[randIdx]);
                }

                this._vampyChoices = arrayShuffle(this._vampyChoices);

                this._currentQuestion++;
                this._delay = Date.now();

                if (this._currentQuestion >= this._maxQuestions) {
                    this._conversationFlow = ConversationFlow.INTERSTITIAL;
                    this._npcDialogue = ActivityConversationManager.getRandomIntermission();
                    this._vampyChoices = [];
                }
            }

        } else {
            this._conversationTick++;

            if (this._conversationTick == this._conversationSpeed) {
                this._conversationTick = 0;

                if (this._word < this._npcTokens.length) {
                    this._word++;
                }
            }

            if (Date.now() > this._conversationDelay + 1200 && !this._showChoice) {

                this._conversationDelay = Date.now();

                switch (this._conversationFlow) {
                    case ConversationFlow.VAMPY_GREETING:
                        this.calculateExposure();
                        this._vampyDialogue = ActivityConversationManager.getVampyGreeting();
                        this._conversationFlow = ConversationFlow.VAMPY_FIRST_CHOICE;
                        break;
                    case ConversationFlow.VAMPY_FIRST_CHOICE:
                        this.calculateExposure();
                        let good: string = "A.) " + ActivityConversationManager.getVampyFirstResponsePositive();
                        let neutral: string = "B.) " + ActivityConversationManager.getVampyFirstResponseNeutral();
                        let negative: string = "C.) " + ActivityConversationManager.getVampyFirstResponseNegative();

                        this._vampyChoices.push(good);
                        //       this._vampyChoices.push(neutral);
                        this._vampyChoices.push(negative);

                        this._showChoice = true;
                        break;
                    case ConversationFlow.VAMPY_COMMITMENT:
                        this.calculateExposure();
                        let commitToActivity: string = "A.) " + ActivityConversationManager.getVampyCommitmentPositive();
                        let rejectActivity: string = "C.) " + ActivityConversationManager.getVampyCommitmentNegative();

                        this._vampyChoices.push(commitToActivity);
                        this._vampyChoices.push(rejectActivity);

                        this._showChoice = true;
                        break;
                    case ConversationFlow.INTERSTITIAL:
                        this.calculateExposure();
                        this._npcDialogue = ActivityConversationManager.getNpcFinalPrompt();
                        this._conversationFlow = ConversationFlow.VAMPY_FINAL_CHOICE;
                        break;
                    case ConversationFlow.VAMPY_FINAL_CHOICE:
                        this.calculateExposure();
                        let finalChoiceGood: string = "A.) " + ActivityConversationManager.getVampyFinalChoicePositive();
                        let finalChoiceNeutral: string = "B.) " + ActivityConversationManager.getVampyFinalChoiceNeutral();
                        let finalChoiceBad: string = "C.) " + ActivityConversationManager.getVampyFinalChoiceNegatve();

                        this._vampyChoices.push(finalChoiceGood);
                        //     this._vampyChoices.push(finalChoiceNeutral);
                        this._vampyChoices.push(finalChoiceBad);

                        this._showChoice = true;
                        break
                    case ConversationFlow.CONVERSATION_OVER:
                        EventBus.publish(new ScreenChangeEvent("apartment"));
                        break;
                }
            }


        }

    }

    mouseClick(x: number, y: number, mouseButton: MouseButton): void {
    }

    mouseMove(x: number, y: number): void {
    }

    renderLoop(): void {
        // Renderer.rect(0, 0, 1024, 768, this._activity.backgroundColor);

        if (this._activity.backgroundSprite != null) {
            Renderer.renderImage(this._activity.backgroundSprite.image, 0, 0, 1024, 768);
        }

        if (this._conversationFlow == ConversationFlow.MINI_GAME) {
            this.renderMiniGame();
        } else {
            this.renderDialogue();
        }


        /*
        let offsetX : number = 100;
        for (let i = 0; i < this._word; i++) {
            Renderer.print(this._npcTokens[i] , offsetX, 200, "Arial", 12, new Color(0,0,0));
            offsetX += Renderer.calculateTextWidth(this._npcTokens[i] + " ", "normal 12px arial");
        }*/


        this._npc.face.renderConversation(-80, 350, 384);


        this._npc.face.renderConversation(680, 350, 384);

        Renderer.rect(0, 700, 1024, 70, new Color(0, 0, 0));

        Renderer.print("Exposure: " + Vampire.exposure, 50, 730, "Arial", 16, new Color(255, 255, 255));
        Renderer.print("Friendship: " + this._points, 150, 730, "Arial", 16, new Color(255, 255, 255));
    }

    renderMiniGame(): void {

       // Renderer.print(this._npc.firstName + ": " + this._npcDialogue, 100, 200, "Arial", 25, new Color(0, 0, 0));


        Renderer.rect(250, 298, 100, 105, new Color(0, 0, 0));
        Renderer.rect(252, 300, 105, 100, new Color(52, 189, 235));

       // this.wordWrap(this._npcDialogue, 180, 340, 400, 300);

        Renderer.print(this._npcDialogue,  290, 340, "Arial", 25, new Color(0, 0, 0));

        Renderer.rect(288, 448, 455, 205, new Color(0, 0, 0));
        Renderer.rect(290, 450, 450, 200, new Color(199, 58, 93));

        let offsetY: number = 490;

        for (let i = 0; i < this._vampyChoices.length; i++) {
            Renderer.print((i + 1) + ")" + this._vampyChoices[i], 310, offsetY, "Arial", 25, new Color(0, 0, 0));

            offsetY += 30;
        }


    }

    private wordWrap(text: string, x: number, y: number, width: number, height: number): void {

        Renderer.print(text, x, y, "Arial", 12, new Color(0, 0, 0));
    }

    renderDialogue(): void {

        let npcWidth: number = Renderer.calculateTextWidth(this._npcDialogue, "normal arial 12px")

        Renderer.rect(148, 298, npcWidth * 1.5 + 5, 105, new Color(0, 0, 0));
        Renderer.rect(150, 300, npcWidth * 1.5, 100, new Color(52, 189, 235));

        this.wordWrap(this._npcDialogue, 180, 340, 400, 300);



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

}
