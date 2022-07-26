

export class PersistentState {

    private static _state:Map<string, Object> = new Map<string, Object>();


    static getState(key : string) : Object {
        return this._state.get(key);
    }

    static hasState(key : string) : boolean {
        return this._state.has(key);
    }

    static setState(key : string, object : Object) : void {
        this._state.set(key, object);
    }


    static deleteState(key: string) {
        this._state.delete(key);
    }
}
