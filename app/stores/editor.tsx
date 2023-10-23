import { makeObservable, runInAction, reaction, observable } from "mobx"

export default class EditorState {
    selected = null

    constructor() {
        makeObservable(this, {
            selected: observable,
        })
    }
}