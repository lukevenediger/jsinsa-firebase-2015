/* globals require, module, console */
/* jshint -W097 */
'use strict';

/******************************
 * 5 - Shared Data
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

        firebase.child('chatroom')
            .child('members')
            .child(userId)
            .set({
                name: name,
                dateAdded: Firebase.ServerValue.TIMESTAMP
            });

        // Make sure we remove ourselves
        // if the connection dies
        firebase.child('chatroom')
            .child('members')
            .child(userId)
            .onDisconnect()
            .remove();
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

    function listenForPresenceUpdates() {

        // User joins
        firebase.child('chatroom')
            .child('members')
            .on('child_added', function(snapshot) {
                if (snapshot.key() === userId) {
                    // Ignore our own presence announcement
                    return;
                }
                var user = snapshot.val();
                view.addMember(user.name, snapshot.key());
            });

        // User leaves
        firebase.child('chatroom')
            .child('members')
            .on('child_removed', function(snapshot) {
                if (snapshot.key() === userId) {
                    // Ignore our own presence announcement
                    return;
                }
                view.removeMember(snapshot.key());
            });

    }

    function onChangeTopic(newTopic) {
        firebase.child('chatroom')
            .child('topic')
            .set(newTopic);
    }

    function listenForTopicChanges() {

        firebase.child('chatroom')
            .child('topic')
            .on('value', function(snapshot) {
                view.setTopic(snapshot.val());
            });

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
                listenForPresenceUpdates();
                listenForTopicChanges();
                console.log('Initialised');
                view.enableLoginBox();
            });
    };

}

module.exports = new FireChat();
