class Note extends Gizmo {
    constructor({_title, _complete, _inProgress}) {
        let template = '' +
            '<li class="note list-group-item">' +
            '<h3 class="title"></h3>' +
            '<div class="container">' +
            '<div class="row">' +
            '<div class="col-xs-8">' +
            '<label>Completed <input type="checkbox" class="isComplete"></label><label>In Progress <input type="checkbox" class="inProgress"></label>' +
            '</div>' +
            '<div class="col-xs-4">' +
            '<div class="btn-group">' +
            '<button type="button" class="btn btn-primary current btn-xs">output current</button>' +
            '<button type="button" class="btn btn-danger delete btn-xs">delete</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</li>';
        super(template);
        this._$el = this._el.firstChild;
        this._data = {
            _title: _title,
            _complete: _complete,
            _inProgress: _inProgress
        };

        this.setCompleteClass(_complete);


        this._inputs = {
            isComplete: {
                el: this._$el.querySelector('.isComplete'),
                val: (val) => {
                    if (val === undefined) {
                        return this._data._complete
                    } else {
                        this.setCompleteClass(val);
                        return this._data._complete = val;
                    }
                }
            },
            inProgress: {
                el: this._$el.querySelector('.inProgress'),
                val: (val) => {
                    if (val === undefined) {
                        return this._data._inProgress
                    } else {
                        return this._data._inProgress = val;
                    }
                }
            }
        };

        this.updateTitle(_title);

        for (let key in this._inputs) {
            let input = this._inputs[key];
            Gizmo.setInput(input.val(), input.el);
            input.el.addEventListener('change', (e) => {
                input.val(Gizmo.getInput(e.target));
                let event = new CustomEvent('updateNote');
                document.dispatchEvent(event);
            });
        }
        this._$el.querySelector('.current').addEventListener('click', () => {
            console.log('complete: ' + this._data._complete);
            console.log('inProgress: ' + this._data._inProgress);
        });

        this._$el.querySelector('.delete').addEventListener('click', () => {
            clearInterval(this.interval);
            let event = new CustomEvent('deleteNote', {detail: this});
            document.dispatchEvent(event);
        });

        this.interval = setInterval(() => {
            console.log('this is "' + this._data._title + '" checking in')
        }, 3000);

        // Add 10MB to each Note to test for memory leaks
        // this.test = (new Array(10 * 1024 * 1024)).join("x");
    }

    setCompleteClass(value) {
        if (value) {
            this._$el.classList.add('complete');
            this._$el.classList.add('text-muted');
        } else {
            this._$el.classList.remove('complete');
            this._$el.classList.remove('text-muted');
        }
    }

    updateTitle(title) {
        this._data._title = title;
        this._$el.querySelector('.title').innerHTML = this._data._title;
    }

    get inProgress() {
        return this._data._inProgress;
    }

    set inProgress(value) {
        this._data._inProgress = value;
    }

    get complete() {
        return this._data._complete;
    }

    set complete(value) {
        this._data._complete = value;
        this.setCompleteClass(value);
    }


    get title() {
        return this._data._title;
    }

    set title(title) {
        this.updateTitle(title);
    }

    get el() {
        return this._$el;
    }

    get data() {
        return this._data;
    }
}

