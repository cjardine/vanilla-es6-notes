"use strict";
class Notes extends Gizmo {

    constructor(app) {
        super();

        this._appEl = document.querySelector('#App');
        this._listEl = this._appEl.querySelector('#list');
        this._addButton = this._appEl.querySelector('#add');
        this._titleIn = this._appEl.querySelector('#title');
        this._hideCompletedEl = this._appEl.querySelector('#hideCompleted');
        this._completeAll = this._appEl.querySelector('#completeAll');
        this._deleteAll = this._appEl.querySelector('#deleteAll');

        this._hideCompleted = true;
        Gizmo.setInput(this._hideCompleted, this._hideCompletedEl);
        this.hideCompleted();

        this.notes = new Array();
        let preExistingNotes = Store.get('notes');

        if (preExistingNotes) {
            this.hydrateNotes(preExistingNotes);
        }

        this._deleteAll.addEventListener('click', (e) => this.deleteAll());
        this._addButton.addEventListener('click', (e) => this.addNote());
        this._completeAll.addEventListener('click', (e) => this.completeAll());
        this._hideCompletedEl.addEventListener('change', (e) => this.hideCompleted());

        document.addEventListener('updateNote', (e) => this.saveNotes());
        document.addEventListener('deleteNote', (e) => this.deleteNote(e));

        this.app.registerBeforeUnload({name: this.id, callback: this.saveNotes.bind(this), order: this.app.orderNames.LAST})

    }

    createNote(data) {
        let newNote = new Note(data, this);
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

    deleteAll() {
        let self = this;
        let promise = new Promise(function (resolve, reject) {
            self._modal = new Modal(resolve, reject, {});
            self._modal._parentEl.appendChild(self._modal.el);
        });

        promise
            .then(function () {
                self.notes.forEach((note, index) => {
                    note.destroy();
                    self._listEl.removeChild(note.el);
                });
                self.notes = [];
                self.saveNotes();
                self._modal = null;
                delete self._modal;
            })
            .catch(function () {
                self._modal = null;
                delete self._modal;
            });
    }

    deleteNote(event) {
        this.notes.forEach((note, index) => {
            if (event.detail === note) {
                note.destroy();
                this._listEl.removeChild(note.el);
                this.notes.splice(index, 1);
            }
        });
        this.saveNotes();
    }

    addNote() {
        let value = this._titleIn.value.trim();
        if (value.length > 0) {
            this.createNote({'_title': value});
        }
        this._titleIn.value = '';
        this.saveNotes();
    }

    updateNotes() {
        this._listEl.innerHTML = '';
        this.notes.forEach((note, index) => {
            this._listEl.appendChild(note.el);
        });
    }

    hideCompleted() {
        this._hideCompleted = Gizmo.getInput(this._hideCompletedEl);
        if (this._hideCompleted) {
            this._appEl.classList.add('hideCompleted');
            // $('.complete').slideUp();
        } else {
            this._appEl.classList.remove('hideCompleted');
            // $('.complete').slideDown();
        }
    }

    completeAll(event) {
        this.notes.forEach((note, index) => {
            note.complete = Gizmo.getInput(this._completeAll);
        });
    }
    showMap(clickedNote) {
        this.notes.forEach((note) => {
            if (clickedNote === note) {
                note.showMap = true;
            }else {
                note.showMap = false;
            }
        });
    }


}