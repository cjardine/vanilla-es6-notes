/*global */
/**
 * User: Chris
 * Date: 11/7/2016, 8:48 AM
 */


class Base {
    constructor() {

    }


    trigger(eventName, eventData, eventElement) {
        let initEvent;
        if (eventData === undefined) {
            initEvent = new CustomEvent(eventName);
        } else {
            initEvent = new CustomEvent('eventName', {'detail': eventData});
        }
        if (eventElement === undefined) {
            document.dispatchEvent(initEvent);
        } else {
            eventElement.dispatchEvent(initEvent);
        }
    }

    listen(eventName, callback, eventElement) {
        let removeListener;
        if (eventElement === undefined) {
            document.addEventListener(eventName, callback);
            removeListener = function() {
                document.removeEventListener(eventName, callback);
            }
        } else {
            eventElement.addEventListener(eventName, callback);
            removeListener = function() {
                eventElement.removeEventListener(eventName, callback);
            }
        }
        return removeListener;
    }
}