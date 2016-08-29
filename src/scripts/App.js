class App {

    constructor() {
        this._appEl = document.querySelector('#App');
        this._listEl = this._appEl.querySelector('#list');
        this._addButton = this._appEl.querySelector('#add');
        this._titleIn = this._appEl.querySelector('#title');
        this._hideCompletedEl = this._appEl.querySelector('#hideCompleted');

        this._hideCompleted = true;
        Gizmo.setInput(this._hideCompleted, this._hideCompletedEl);
        this.hideCompleted();

        this.notes = new Array();
        let preExistingNotes = Store.get('notes');

        if (preExistingNotes) {
            this.hydrateNotes(preExistingNotes);
        }

        this._addButton.addEventListener('click', (e) => this.addNote());
        this._hideCompletedEl.addEventListener('change', (e) => {
            this.hideCompleted();
        });

        document.addEventListener('updateNote', (e) => this.saveNotes());
        document.addEventListener('deleteNote', (e) => this.deleteNote(e));

    }

    createNote(data) {
        let newNote = new Note(data);
        this.notes.push(newNote);
        this._listEl.appendChild(newNote.el);
    }

    hydrateNotes(notes) {
        notes.forEach((note) => this.createNote(note));
    }

    notesToArray() {
        let tempArray = new Array();
        this.notes.forEach((note) => tempArray.push(note.data));
        return tempArray;
    }

    saveNotes() {
        Store.set('notes', this.notesToArray());
    }

    deleteNote(event) {
        let scope = this;
        this.notes.forEach(function (note, index) {
            if (event.detail === note) {
                scope._listEl.removeChild(note.el);
                scope.notes.splice(index, 1);
            }
        });
        this.saveNotes();
    }

    addNote() {
        let value = this._titleIn.value.trim();
        if (value.length > 0) {
            this.createNote({'_title': value});
        }
        this.saveNotes();
    }

    updateNotes() {
        let scope = this;
        this._listEl.innerHTML = '';
        this.notes.forEach(function (note, index) {
            scope._listEl.appendChild(note.el);
        });
    }

    hideCompleted() {
        this._hideCompleted = Gizmo.getInput(this._hideCompletedEl);
        if (this._hideCompleted) {
            this._appEl.classList.add('hideCompleted')
        } else {
            this._appEl.classList.remove('hideCompleted')
        }
    }

}

document.addEventListener('DOMContentLoaded', function () {
    window.app = new App();
});
