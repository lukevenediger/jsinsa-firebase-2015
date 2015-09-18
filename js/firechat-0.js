/* globals require, module, console */
/* jshint -W097 */
'use strict';

/******************************
 * 0 - Base
 ******************************/

var view = require('./view.js'),
    q = require('Q'),
    Firebase = require('firebase'),
    Settings = require('./settings.js');

function FireChat() {

    var fullName;
    var userId;

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

        userId = new Date().getTime() + '';

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
            .then(function(uid) {
                //userId = uid;
                view.enableLoginBox();
                console.log('initialised');
            });
    };

}

module.exports = new FireChat();
