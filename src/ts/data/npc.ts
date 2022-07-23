import {faker} from '@faker-js/faker';
import {Activities} from "./activities";
import {logger, LogType} from "@alexayers/teenytinytwodee";
import { v4 as uuidv4 } from 'uuid';

export class Npc {

    private _id : string;
    private _firstName: string;
    private _lastName: string;
    private _friendShip: number = 0;
    private _favoriteActivities:Array<string> = [];

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

    get favoriteActivities(): Array<string> {
        return this._favoriteActivities;
    }

    set favoriteActivities(value: Array<string>) {
        this._favoriteActivities = value;
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

            let set:Set<string> = new Set<string>();

            for (let i = 0; i < 3; i++) {
                try {
                    set.add(Activities.getRandomActivity().activity);
                } catch (e) {}
            }

            set.forEach((entry) => {
               npc.favoriteActivities.push(entry);
            });

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
