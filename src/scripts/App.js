"use strict";
class App {
    constructor() {
        this._gizmos = {};
        for (let gizmo of App.gizmoList) {
            this.registerGizmo(gizmo);
        }

        /**
         * _orderNames
         * @enum {{FIRST: string, MIDDLE: string, LAST: string}}
         * @private
         */
        this._orderNames = {
            FIRST: 'first',
            MIDDLE: 'middle',
            LAST: 'last'
        };

        this._unload = {
            first: [],
            middle: [],
            last: []
        };

        this.mapReady = mapReady;

        window.addEventListener('beforeunload', () => this.beforeUnload());
        return this;
    }


    init() {
        this._notes = new Notes();
        let initEvent = new CustomEvent('AppInit');
        document.dispatchEvent(initEvent);
    }


    registerGizmo({name, className, query}) {
        this._gizmos[name] = {className, query};
    }

    deregisterGizmo(name) {
        delete this._gizmos[name];
    }

    /**
     * registerBeforeUnload
     * @param name
     * @param callback
     * @param {_orderNames} order
     */
    registerBeforeUnload({name, callback, order}) {
        this._unload[order].unshift({name, callback});
    }

    deregisterBeforeUnload(name, order) {
        let done = false;
        if (order === undefined) {
            this._unload.first.forEach((unloadObject,iteration, array) => {
                if (unloadObject.name === name) {
                    this._unload.first.splice(iteration, 1);
                    done = true;
                    return true;
                }
            });
            if (!done) {
                this._unload.middle.forEach((unloadObject,iteration, array) => {
                    if (unloadObject.name === name) {
                        this._unload.middle.splice(iteration, 1);
                        done = true;
                        return true;
                    }
                });
            }
            if (!done) {
                this._unload.last.forEach((unloadObject,iteration, array) => {
                    if (unloadObject.name === name) {
                        this._unload.last.splice(iteration, 1);
                        done = true;
                        return true;
                    }
                });
            }
        } else {

            this._unload[order].forEach((unloadObject,iteration, array) => {
                if (unloadObject.name === name) {
                    this._unload[order].splice(iteration, 1);
                    return true;
                }
            })
        }
    }

    beforeUnload() {
        this._unload.first.forEach((unloadObject) => {unloadObject.callback();});
        this._unload.middle.forEach((unloadObject) => {unloadObject.callback();});
        this._unload.last.forEach((unloadObject) => {unloadObject.callback();});
    }


    get orderNames() {
        return this._orderNames;
    }

    get gizmos() {
        return this._gizmos;
    }

    get mapReady() {
        return this._mapReady;
    }

    set mapReady(value) {
        this._mapReady = value;
        let event = new CustomEvent('mapReady', {detail: {value: value}});
        document.dispatchEvent(event);
    }

    static app() {
        return window.app;
    }
}

App.gizmoList = [];

document.addEventListener('DOMContentLoaded', function () {
    window.app = new App();
    window.app.init();
});

function initMap() {
    if (window.app) {
        window.app.mapReady = true;
    }
    window.mapReady = true;
}

window.mapReady = false;
