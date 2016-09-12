/*global */

class Modal extends Gizmo {
    constructor(resolve, reject) {
        let template = '' +
            '<div class="modal">' +
            '<p>title</p>' +
            '<button id="affirmative">yes</button>' +
            '<button id="negative">no</button>' +
            '</div>';

        super(template, document.body);

        this._resolve = resolve;
        this._reject = reject;

        this._affirmative = this._el.querySelector('#affirmative');
        this._negative = this._el.querySelector('#negative');

        this._affirmative.addEventListener('click', () => this.resolve());
        this._negative.addEventListener('click', () => this.reject());

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