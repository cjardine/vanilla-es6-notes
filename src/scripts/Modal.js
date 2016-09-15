"use strict";

class Modal extends Gizmo {
    constructor(resolve, reject, {title = 'Default Title', description = "Default description.", affirmative = "Yes", negative = "No"}) {
        let template = '' +
            '<div class="modalContainer">' +
            '<div class="modal">' +
            '<p class="title"></p>' +
            '<p class="description"></p>' +
            '<button class="affirmative"></button>' +
            '<button class="negative"></button>' +
            '</div>' +
            '</div>';

        super(template, document.body);

        this._resolve = resolve;
        this._reject = reject;

        this._title = this._el.querySelector('.title');
        this._title.innerHTML = title;

        this._description = this._el.querySelector('.description');
        this._description.innerHTML = description;

        this._affirmative = this._el.querySelector('.affirmative');
        if (resolve === undefined) {
            this._affirmative.classList.add('hidden');
        } else {
            this._affirmative.innerHTML = affirmative;
            this._affirmative.addEventListener('click', () => this.resolve());
        }

        this._negative = this._el.querySelector('.negative');
        if (reject === undefined) {
            this._negative.classList.add('hidden');
        } else {
            this._negative.innerHTML = negative;
            this._negative.addEventListener('click', () => this.reject());
        }

    }

    resolve() {
        this._resolve();
        document.body.removeChild(this.el)
    }

    reject() {
        this._reject();
        document.body.removeChild(this.el)
    }
}