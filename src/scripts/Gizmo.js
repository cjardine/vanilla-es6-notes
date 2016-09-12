class Gizmo {
    constructor(template, parentEl) {
        if (parentEl) {
            this._parentEl = parentEl;
            this._parentEl.data = {instance: this};
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
            App.app().parseGizmo(this.el);
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

    get el() {
        return this._$el;
    }

    get parent() {
        return this._parentEl;
    }

}