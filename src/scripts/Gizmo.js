class Gizmo {
    constructor(template) {
        var div = document.createElement("div");
        div.innerHTML = template;
        var fragment = document.createDocumentFragment();
        while (div.firstChild) {
            fragment.appendChild(div.firstChild);
        }
        this._el = fragment;
    }

    static setInput(value, el) {
        let output;
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
        return output;
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
}