class App {
    constructor() {
        this._gizmos = {};
        for (let gizmo of App.gizmoList) {
            this.registerGizmo(gizmo);
        }
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

    parseGizmo(el) {
        for (let gizmoName in this._gizmos) {
            if (this._gizmos.hasOwnProperty(gizmoName)) {
                let gizmo = this._gizmos[gizmoName];
                let matches = el.querySelectorAll(gizmo.query);
                matches.forEach((match) => {
                    new gizmo.className(match)
                });
            }
        }
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
