"use strict";
class Note extends Gizmo {
    constructor({
        _title = '',
        _complete = false,
        _inProgress = false,
        _created = new Date(),
        _timeSpent = [],
        _location
    }, parentScope) {
        let template = '' +
            '<li class="note">' +
            '<div class="columns">' +
            '<div class="column column-flex">' +
            '<h3 class="title"></h3>' +
            '<p>Total Time: <span class="totalTime"></span></p>' +
            '<label><checkbox value="" class="isComplete"></checkbox> Completed </label> <label><checkbox value="" class="inProgress"></checkbox> In Progress </label>' +
            '</div>' +
            '<div class="column">' +
            '<p>' +
            '<button type="button" class="current">output current</button>' +
            '<button type="button" class="delete">delete</button>' +
            '</p>' +
            '<p>' +
            '<button type="button" class="location">show map</button>' +
            '</p>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<map gz-model="data._location.model"></map>' +
            '</div>' +
            '</li>';
        super(template);

        this._data = {
            _title: _title,
            _complete: _complete,
            _inProgress: _inProgress,
            _created: _created,
            _timeSpent: _timeSpent,
            _location: _location
        };

        this.location = new Location();

        if (this._data._location) {
            this.location.model = this._data._location;
        } else {
            this._data._location = this.location.model;
        }

        this.location.updateCallback = () => {this._data._location = this.location.model; this.save();};


        this._timer = null;


        this.updateTitle(_title);

        this.app.registerBeforeUnload({
            name: this.id,
            callback: this.destroy.bind(this),
            order: this.app.orderNames.FIRST
        });
        this.init();
    }

    init() {
        super.init();

        this._inputs = {
            isComplete: {
                el: this.el.querySelector('.isComplete')
            },
            inProgress: {
                el: this.el.querySelector('.inProgress')
            }
        };


        this._inputs.isComplete.el.data.instance.value = this._data._complete;

        this._inputs.isComplete.el.addEventListener('update', (e) => {
            this.complete = e.detail.value;
            this.save();
        });

        this._inputs.inProgress.el.data.instance.value = this._data._inProgress;

        this._inputs.inProgress.el.addEventListener('update', (e) => {
            this.inProgress = e.detail.value;
            this.save();
        });

        this.map = this.el.querySelector('map');
        this.showMapButton = this.el.querySelector('.location');
        this.showMapButton.addEventListener('click', () => {
            if (this.showMap) {
                this.showMap = !this.showMap;
            } else {
                this.app._notes.showMap(this);
            }
        });

        this.el.querySelector('.current').addEventListener('click', () => {
            console.log('complete: ' + this._data._complete);
            console.log('inProgress: ' + this._data._inProgress);
        });

        this.el.querySelector('.delete').addEventListener('click', () => {
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
        this.inProgress = this._data._inProgress;
        this.complete = this._data._complete;

        this._showMap = false;
        this.showMap = this._showMap;
    }

    destroy() {
        this.stopLastTimeSpent();
        this.app.deregisterBeforeUnload({name: this.id, order: this.app.orderNames.FIRST});
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

    save() {
        let event = new CustomEvent('updateNote');
        document.dispatchEvent(event);
    }

    updateTitle(title) {
        this._data._title = title;
        this.el.querySelector('.title').innerHTML = this._data._title;
    }

    stopLastTimeSpent() {
        let timeSpentLength = this._data._timeSpent.length;
        if (timeSpentLength > 0 && this._data._timeSpent[timeSpentLength - 1].end === undefined) {
            this._data._timeSpent[timeSpentLength - 1].end = new Date();
        }
        clearInterval(this._timer);
        this._timer = null;
    }

    _calculateTime() {
        let currentDate = new Date();
        let totalTime = 0, timeString = "", tempTime, years, months, days, hours, mins, seconds;


        this._data._timeSpent.forEach((entry) => {
            if (entry.end === undefined) {
                totalTime += currentDate - new Date(entry.start);
            } else {
                totalTime += new Date(entry.end) - new Date(entry.start);
            }
        });

        years = Math.floor(totalTime / 31104000000);
        if (years > 0) {
            timeString += years + " years"
        }

        tempTime = totalTime % 31104000000;
        months = Math.floor(tempTime / 2592000000);
        if (months > 0) {
            if (timeString.length) {
                timeString += ", "
            }
            timeString += months + " months"
        }

        tempTime = tempTime % 2592000000;
        days = Math.floor(tempTime / 86400000);
        if (days > 0) {
            if (timeString.length) {
                timeString += ", "
            }
            timeString += days + " days"
        }

        tempTime = tempTime % 86400000;
        hours = Math.floor(tempTime / 3600000);
        if (hours > 0) {
            if (timeString.length) {
                timeString += ", "
            }
            timeString += hours + " hours"
        }

        tempTime = tempTime % 3600000;
        mins = Math.floor(tempTime / 60000);
        if (mins > 0) {
            if (timeString.length) {
                timeString += ", "
            }
            timeString += mins + " minutes"
        }

        tempTime = tempTime % 60000;
        seconds = Math.floor(tempTime / 1000);
        if (seconds > 0) {
            if (timeString.length) {
                timeString += ", "
            }
            timeString += seconds + " seconds"
        }

        if (timeString.length === 0) {
            timeString = '0';
        }

        this.el.querySelector('.totalTime').innerHTML = timeString;
    }


    get inProgress() {
        return this._data._inProgress;
    }

    set inProgress(value) {
        let timeSpentLength = this._data._timeSpent.length;
        if (this._data._inProgress !== value) {
            this._data._inProgress = value;
        }
        if (value) {
            if (this._data._complete) {
                this.complete = false;
            }
            if ((timeSpentLength === 0 || (timeSpentLength > 0 && this._data._timeSpent[timeSpentLength - 1].end !== undefined))) {
                this._data._timeSpent.push(new TimeSpent());
            }
            if (this._timer === null) {
                this._timer = setInterval(() => {
                    this._calculateTime();
                }, 500)
            }
        } else if (!value) {
            this._calculateTime();
            this.stopLastTimeSpent();
        }
        this._inputs.inProgress.el.data.instance.value = value;
    }

    get complete() {
        return this._data._complete;
    }

    set complete(value) {
        if (this._data._complete !== value) {
            if (this._data._inProgress && value) {
                this.inProgress = false;
            }
            this._data._complete = value;
            this._inputs.isComplete.el.data.instance.value = value;
        }
        this.setCompleteClass(value);
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

    get showMap() {
        return this._showMap;
    }

    set showMap(value) {
        this._showMap = value;
        if (value) {
            this.map.classList.remove('hidden');
            let event = new CustomEvent('refreshMap');
            this.map.dispatchEvent(event);
            this.showMapButton.innerHTML = 'hide map'

        } else {
            this.map.classList.add('hidden');
            this.showMapButton.innerHTML = 'show map'
        }
    }

    get location() {
        return this._data._location;
    }

    set location(value) {
        this._data._location = value;
    }

}

class TimeSpent {
    constructor() {
        this.start = new Date();
        this.end = undefined;
    }
}
