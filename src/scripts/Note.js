class Note extends Gizmo {
    constructor({_title = '', _complete = false, _inProgress = false}) {
        let template = '' +
            '<li class="note list-group-item">' +
            '<h3 class="title"></h3>' +
            '<div class="container">' +
            '<div class="row">' +
            '<div class="col-xs-8 checkbox">' +
            '<label><checkbox value="" class="isComplete"></checkbox> Completed </label> <label><checkbox value="" class="inProgress"></checkbox> In Progress </label>' +
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
        this._data = {
            _title: _title,
            _complete: _complete,
            _inProgress: _inProgress
        };

        this.setCompleteClass(_complete);

        this._inputs = {
            isComplete: {
                el: this.el.querySelector('.isComplete')
            },
            inProgress: {
                el: this.el.querySelector('.inProgress')
            }
        };

        this.updateTitle(_title);

        this._inputs.isComplete.el.data.instance.value = this._data._complete;
        this._inputs.isComplete.el.addEventListener('update', (e) => {
                this.complete = e.detail.value;
                let event = new CustomEvent('updateNote');
                document.dispatchEvent(event);
            });
        this._inputs.inProgress.el.data.instance.value = this._data._inProgress;
        this._inputs.inProgress.el.addEventListener('update', (e) => {
                this.inProgress = e.detail.value;
                let event = new CustomEvent('updateNote');
                document.dispatchEvent(event);
            });

        this._$el.querySelector('.current').addEventListener('click', () => {
            console.log('complete: ' + this._data._complete);
            console.log('inProgress: ' + this._data._inProgress);
        });

        this._$el.querySelector('.delete').addEventListener('click', () => {
            clearInterval(this.interval);
            let event = new CustomEvent('deleteNote', {detail: this});
            document.dispatchEvent(event);
        });

        // Ping heartbeat
        // this.interval = setInterval(() => {
        //     console.log('this is "' + this._data._title + '" checking in')
        // }, 3000);

        // Add 10MB to each Note to test for memory leaks
        // this.test = (new Array(10 * 1024 * 1024)).join("x");
    }

    setCompleteClass(value) {
        if (value) {
            this.el.classList.add('complete');
            this.el.classList.add('text-muted');
        } else {
            this.el.classList.remove('complete');
            this.el.classList.remove('text-muted');
        }
    }

    updateTitle(title) {
        this._data._title = title;
        this.el.querySelector('.title').innerHTML = this._data._title;
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
        if (this._data._complete !== value) {
            this._data._complete = value;
            this.setCompleteClass(value);
            this._inputs.isComplete.el.data.instance.value = value;
        }
    }


    get title() {
        return this._data._title;
    }

    set title(title) {
        this.updateTitle(title);
    }

    get data() {
        return this._data;
    }
}

