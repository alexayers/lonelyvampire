import {faker} from '@faker-js/faker';
import {Activity, ActivityManager} from "./activityManager";
import {logger, LogType} from "@alexayers/teenytinytwodee";
import { v4 as uuidv4 } from 'uuid';

export class Npc {

    private _id : string;
    private _firstName: string;
    private _lastName: string;
    private _friendShip: number = 0;
    private _favoriteActivity:string = "";
    private _yearBook: string = "";
    private _dislikes: string = "";

    constructor() {

    }


    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get friendShip(): number {
        return this._friendShip;
    }

    set friendShip(value: number) {
        this._friendShip = value;
    }

    get favoriteActivity(): string {
        return this._favoriteActivity;
    }

    set favoriteActivity(value: string) {
        this._favoriteActivity = value;
    }


    get yearBook(): string {
        return this._yearBook;
    }

    set yearBook(value: string) {
        this._yearBook = value;
    }


    get dislikes(): string {
        return this._dislikes;
    }

    set dislikes(value: string) {
        this._dislikes = value;
    }
}

export class NpcManager {

    static _npcs:Array<Npc> = [];
    static _npcLookUp:Map<string, Npc> = new Map<string, Npc>();

    static init(totalNpcs: number) {

        for (let i = 0; i < totalNpcs; i++) {
            let npc = new Npc();
            npc.firstName = faker.name.firstName();
            npc.lastName = faker.name.lastName();
            npc.id = uuidv4();

            let activity : Activity = ActivityManager.getRandomActivity();

            npc.favoriteActivity = activity.activity;
            npc.yearBook = activity.yearbook;
            npc.dislikes = ActivityManager.getRandomActivity().activity;



            logger(LogType.INFO, "Created new npc ->" + JSON.stringify(npc));
            NpcManager._npcs.push(npc);
            NpcManager._npcLookUp.set(npc.id, npc);
        }

    }

    static getNpcs() : Array<Npc> {
        return NpcManager._npcs;
    }

    static getNpc(id: string) : Npc {
        return NpcManager._npcLookUp.get(id);
    }


}
