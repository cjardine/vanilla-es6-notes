"use strict";

class Location {
    constructor() {
        this._model = {
            isSet: false,
            coords: {
                lat: 0, lng: 0
            },
            address: ''
        };

        this._callback = () => {};
    }

    set model(model) {
        this._model.isSet = model.isSet;
        this._model.coords = model.coords;
        this._model.address = model.address;
        this._callback();
    }

    get model() {
        return this._model;
    }

    set updateCallback(callback) {
        this._callback = callback;
    }
}