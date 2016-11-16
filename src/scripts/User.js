/*global */
/**
 * User: Chris
 * Date: 11/7/2016, 8:38 AM
 */

class User extends Base {
    constructor() {

        super();

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.user = user;
                this.trigger('UserAuthorized');
            } else {
                this.trigger('UserUnauthorized');
            }
        });

    }


    get name() {
        return this._name;
    }

    set user(userDetails) {
        this._nameame = userDetails.displayName;
        this._email = userDetails.email;
        this._emailVerified = userDetails.emailVerified;
        this._photoURL = userDetails.photoURL;
        this._uid = userDetails.uid;
        this._providerData = userDetails.providerData;
    }

}