"use strict";
class Gizmo {
    constructor(template, parentEl) {
        if (parentEl) {
            this._parentEl = parentEl;
            if (parentEl.data === undefined) {
                parentEl.data = {};
            }
            if (parentEl.data.$$parentScope) {
                this.parentScope = parentEl.data.$$parentScope;
            }
            this._parentEl.data.instance = this;
        }

        if (template !== undefined) {
            var div = document.createElement("div");
            div.innerHTML = template;
            var fragment = document.createDocumentFragment();
            while (div.firstChild) {
                fragment.appendChild(div.firstChild);
            }
            this._el = fragment;
            this._$el = this._el.firstChild;
            this.id = Gizmo.UUID();
            if (parentEl) {
                this.parent.appendChild(this.el);
            }
        }
    }

    init() {
        this.parseGizmo(this.el);
    }

    parseGizmo(el) {
        let gizmos = App.app()._gizmos;
        for (let gizmoName in gizmos) {
            if (gizmos.hasOwnProperty(gizmoName)) {
                let gizmo = gizmos[gizmoName];
                let matches = el.querySelectorAll(gizmo.query);
                if (matches.length) {
                    if (!matches.forEach) {
                        matches = Array.prototype.slice.call(matches)
                    }
                    matches.forEach((match) => {
                        if (match.data === undefined) {
                            match.data = {};
                        }
                        match.data.$$parentScope = this;
                        let newGizmo = new gizmo.className(match);
                    });
                }
            }
        }
    }

    parseInternals() {
        if (this.parent) {
            let modelString = this.parent.getAttribute('gz-model');
            if (modelString !== undefined && modelString !== null && modelString !== '') {
                let modelStringArray = modelString.split('.');
                let model = this.parentScope;
                modelStringArray.forEach((string) => {
                    model = model[string];
                });
                this.model = model;
            }
        }
    }

    static setInput(value, el) {
        if (el.nodeName === 'INPUT') {
            switch (el.getAttribute('type')) {
            case 'checkbox':
                el.checked = value;
                break;
            case 'text':
                el.value = value;
                break;
            }
        }
    }

    static getInput(el) {
        let output;
        if (el.nodeName === 'INPUT') {
            switch (el.getAttribute('type')) {
            case 'checkbox':
                output = el.checked;
                break;
            case 'text':
                output = el.value;
                break;
            }
        }
        return output;
    }

    /**
     * UUID
     * @returns {string}
     * @constructor
     */
    static UUID() {
        let id = '';
        for (let i = 0; i < 16; i++) {
            let num = Math.floor(Math.random() * 16);
            id += num.toString(16);
        }
        return id + '-' + Date.now().toString(16);
    }

    get el() {
        return this._$el;
    }

    get parent() {
        return this._parentEl;
    }

    get parentScope() {
        return this._parentScope;
    }

    set parentScope(scope) {
        this._parentScope = scope;
        this.parseInternals();
    }

    get model() {
        return this._model;
    }

    set model(model) {
        this._model = model;
        console.log(model);
    }

    get app() {
        return App.app();
    }
}