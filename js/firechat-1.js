/* globals require, module, console */
/* jshint -W097 */
'use strict';

/******************************
 * 1 - Initialisation
 ******************************/

var view = require('./view.js'),
    q = require('Q'),
    Firebase = require('firebase'),
    Settings = require('./settings.js');

function FireChat() {

    var fullName;
    var userId;
    var firebase;

    function onEnter(name) {
        fullName = name;
        view.addMember(name, userId);
        view.setUsername(name);
    }

    function onLeave() {
        view.removeMember(userId);
        view.clearMessages();
    }

    function onAddMessage(message) {
        view.addMessage(fullName, message);
    }

    function onChangeTopic(newTopic) {
        view.setTopic(newTopic);
    }

    function initialiseFirebase() {
        var deferred = q.defer();

        // Initialise firebase
        firebase = new Firebase(Settings.firebaseUrl);

        // Do anonymous auth
        firebase.authAnonymously(function(error, context) {
            if (error) {
                deferred.reject(error, context);
            } else {
                deferred.resolve(context.uid);
            }
        });

        return deferred.promise;
    }

    // public API
    this.initialise = function() {

        // Rig up the events
        view.onEnter = onEnter;
        view.onLeave = onLeave;
        view.onAddMessage = onAddMessage;
        view.onChangeTopic = onChangeTopic;

        // Initialise the view
        view.initialise()
            .then(initialiseFirebase)
            .then(function initialised(uid) {
                userId = uid;
                console.log('Initialised');
                view.enableLoginBox();
            });
    };

}

module.exports = new FireChat();
