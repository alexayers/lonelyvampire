

export class Vampire {

    private static _totalFriends : number = 0;
    private static _exposure : number = 0;
    private static _hunger: number = 0;
    private static _calling : string;
    private static _activity : string;


    static get activity(): string {
        return this._activity;
    }

    static set activity(value: string) {
        this._activity = value;
    }

    static get hunger(): number {
        return this._hunger;
    }

    static set hunger(value: number) {
        this._hunger = value;
    }

    static get totalFriends(): number {
        return this._totalFriends;
    }

    static set totalFriends(value: number) {
        this._totalFriends = value;
    }

    static get exposure(): number {
        return this._exposure;
    }

    static set exposure(value: number) {
        this._exposure = value;
    }

    static get calling(): string {
        return this._calling;
    }

    static set calling(value: string) {
        this._calling = value;
    }
}
