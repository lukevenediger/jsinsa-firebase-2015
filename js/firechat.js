/* globals require, module, console */
/* jshint -W097 */
'use strict';

var view = require('./view.js'),
    q = require('Q'),
    Firebase = require('firebase');

function FireChat() {

    var fullName;
    var userId;
    var firebase;

    function onEnter(name) {
        fullName = name;
        view.addMember(name, userId);
        view.setUsername(name);

        firebase.child('chatroom')
            .child('members')
            .child(userId)
            .set({
                dateAdded: Firebase.ServerValue.TIMESTAMP
            });
    }

    function onLeave() {
        view.removeMember(userId);
        view.clearMessages();

        firebase.child('chatroom')
            .child('members')
            .child(userId)
            .set(null);
    }

    function onAddMessage(message) {
        view.addMessage(fullName, message);
    }

    function onChangeTopic(newTopic) {
        view.setTopic(newTopic);
    }

    function initialiseFirebase() {
        var deferred = q.defer();

        firebase = new Firebase('https://jsinsademo.firebaseio.com/');

        firebase.authAnonymously(function (error, context) {
            deferred.resolve(context.uid);
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
            .then(initialiseFirebase())
            .then(function(uid) {
                userId = uid;
                view.enableLoginBox();
                console.log('initialised');
            });
    };

}

module.exports = new FireChat();
