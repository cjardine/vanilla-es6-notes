"use strict";
class CheckBox extends Gizmo {
    constructor(parentEl) {
        let template = '' +
            '<input type="checkbox">';
        super(template, parentEl);
        let startValue = this.parent.getAttribute('value').toLowerCase();


        if (startValue === 'true') {
            this.value = true;
        } else if (startValue === 'false') {
            this.value = false;
        } else {
            this.value = false;
        }

        this.el.addEventListener('change', (event) => {
            this.value = Gizmo.getInput(event.currentTarget)
        });


        this.init();
    }

    get value() {
        return this._value;
    }

    set value(value) {
        if (this._value !== value) {
            this._value = value;
            Gizmo.setInput(value, this.el);
            let event = new CustomEvent('update', {detail: {value: value}});
            this.parent.dispatchEvent(event);
        }
    }
}
App.gizmoList.push({name: 'CheckBox', className: CheckBox, query: 'checkbox'});
