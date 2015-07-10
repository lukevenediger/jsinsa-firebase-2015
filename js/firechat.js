/* globals require, module, console */
/* jshint -W097 */
'use strict';

var view = require('./view.js'),
    q = require('Q'),
    Firebase = require('firebase');

function FireChat() {

    var fullName;
    var userId;

    function onEnter(name) {
        fullName = name;
        userId = new Date().getTime() + '';
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

        deferred.resolve();

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
            .then(initialiseFirebase())
            .then(function() {
                view.enableLoginBox();
                console.log('initialised');
            });
    };

}

module.exports = new FireChat();
