

export class Vampire {

    private static _totalFriends : number = 0;
    private static _exposure : number = 0;
    private static _calling : string;


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
