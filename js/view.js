/* globals require, module */
/* jshint -W097 */
'use strict';

var $ = require('jquery'),
    q = require('Q');

function View() {

    var self = this;

    function hookEvents() {

        $('#fullName').keyup(function(e) {
            if (e.keyCode === 13) {
                $('#login').click();
            }
        });

        $('#login').click(function() {
            var fullName = $('#fullName').val();
            $('#loginBox').hide();
            self.onEnter(fullName);
        });

        $('#leave').click(function() {
            $('#userFullName').text('');
            $('#loginBox').show();
            $('#fullName').focus();
            self.onLeave();
        });

        $('#inputMessage').keyup(function(e) {
                if (e.keyCode === 13) {
                    $(this).trigger('message');
                }
            })
            .bind('message', function() {
                self.onAddMessage($(this).val());
                $(this).val('');
            });

        $('#cancelTopicChange').click(function() {
            $('#topicBox').hide();
        });

        $('#newTopic').keyup(function(e) {
            if (e.keyCode === 13) {
                $('#changeTopic').click();
            }
        });

        $('#changeTopic').click(function() {
            var topic = $('#newTopic').val();
            self.onChangeTopic(topic);
            $('#topicBox').hide();
        });

        $('#topic').click(function() {
            var topic = $('#topic').text();
            $('#topicBox').show();
            $('#newTopic').val(topic)
                .focus();
        });
    }

    this.initialise = function() {
        var deferred = q.defer();

        $(function() {
            hookEvents();
            $('#loginBox').show();
            $('#fullName').focus();
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.enableLoginBox = function() {
        $('#login').removeAttr('disabled');
        $('#fullName').removeAttr('disabled');
    };

    this.addMessage = function(author, message, isPrivate) {
        var rawSnippet = $('#snippet-message')[0].outerHTML;

        var initials = '';
        author.split(' ').forEach(function (part) {
            if (part !== '') {
                initials += part[0];
            }
        });

        rawSnippet = rawSnippet.replace("${INITIALS}", initials.toUpperCase())
            .replace('snippet-message', '')
            .replace('${MESSAGE}', message);

        if (isPrivate) {
            rawSnippet = rawSnippet.replace('list-group-item', 'list-group-item private');
        }

        $('#messages').append($(rawSnippet))
            .find('div.list-group-item:last')[0].scrollIntoView();
    };

    this.addMember = function(name, userId) {
        var escapedUserId = userId.replace(':', '_').replace('-', '_');
        if ($('#' + escapedUserId).length !== 0) {
            // Don't add the same member twice
            return;
        }

        var rawSnippet = $('#snippet-member')[0].outerHTML;

        rawSnippet = rawSnippet.replace('${FULLNAME}', name)
            .replace('snippet-member', escapedUserId)
            .replace('${USERID}', userId);

        $('#members').append($(rawSnippet));
    };

    this.setUsername = function(name) {
        $('#userFullName').text(name + ' - ');
    };

    this.removeMember = function(userId) {
        userId = userId.replace(':', '_').replace('-', '_');
        $('#' + userId).remove();
    };

    this.clearMessages = function() {
        $('#messages').empty();
    };

    this.setTopic = function(topic) {
        $('#topic').text(topic);
    };

    this.onEnter = function() {};
    this.onLeave = function() {};
    this.onAddMessage = function() {};
    this.onChangeTopic = function() {};
}

module.exports = new View();
