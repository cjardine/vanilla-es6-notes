/*global */
/**
 * User: Chris
 * Date: 8/28/2016, 3:40 PM
 */

class Store {
    constructor() {
        this._store = window.localStorage;
    }

    static store() {
        return window.localStorage;
    }

    static get(key) {
        let string;
        try {
            string = JSON.parse(Store.store().getItem(key));
        } catch (e) {}
        return string;
    }
    static set(key, value) {
        try {
        Store.store().setItem(key, JSON.stringify(value));
        } catch (e) {}                                               
    }
}