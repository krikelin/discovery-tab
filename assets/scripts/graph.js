'use strict';
(function (context) {
    'use strict';
    
    
	
    require(['$api/models', '$api/library', '$api/relations', '$api/activity', 'strings/main.lang'], function (models, library, relations, activity, mainStrings) {
        models.application.readFile('assets/templates/entry2.html').done(function (graph_template) {
            var Graph = function () {
                var self = this;

            };
            Graph.prototype.init = function () {
                console.log('a');
                this.fetchNewObjects();
            };
            Graph.prototype.fetchNewObjects = function () {
              //  var template = slab.compile(document.querySelector('script[type="text/slab"]').innerText);
                var acts = [];
                var activities = [];
                relations.Relations.forCurrentUser().load('subscriptions').done(function (users) {
                    users.subscriptions.snapshot().done(function (users) {
                        for (var i = 0; i < 5 && i < users.length; i++) {
                            var index = Math.round(Math.random() * users.length - 1);
                            var user = users.get(index);
                            if (index > 0 && index < users.length) {
                                // Add news from the user
                                library.Library.forUser(user).load('published').done(function (items) {
                                    items.published.snapshot().done(function (published) {
                                        for (var j = 0; j < 5 && j < published.length; j++) {
                                            var index = Math.round(Math.random() * published.length - 1);
                                            if (index > 0 && index < published.length - 1) {
                                                var playlist = published.get(index);
                                                var activity = {
                                                    user: {
                                                        username:playlist.user.username,
                                                        uri: playlist.user.uri
                                                    },
                                                    activityType: "track-started-playing",
                                                    timestamp: new Date(),
                                                    item: {
                                                        name: playlist.name.decodeForHTML(),
                                                        uri: playlist.uri,

                                                    },
                                                    /*  context: {
                                                            uri:  playlist.uri,
                                                            name: playlist.name
                                                        },
                                                        referrer: {
                                                            uri: playlist.uri,
                                                            image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTQH7myvhGQ32L3gTvQ252Ky-u1sMkVm0YsANmH-7SnAxT1wT780A'
                                                        }*/
                                                };
                                                appendEntry(template, activity);
                                            }
                                        }
                                    });
                                });
                            }
                        }
                        console.log(user);
                        
                    });
                });
               
                   
                   
            };

            var graph = new Graph();
            graph.init();
            window.addEventListener('load', graph.init);
        });
    });
    function appendEntry(template, activity) {
       // var content = template.post({ activity: activity, text: mainStrings.get('activity', activity.user.uri, activity.user.name, activity.activityType, activity.item.uri, activity.item.name) });
        
       // console.log(content);
        var div = document.createElement('div');
        div.classList.add('width2');
        div.classList.add('post');
        div.classList.add('height5');
        div.style.cssFloat = 'left';
        div.innerHTML = '<a href="' + activity.user.username + '">' + activity.user.uri + '</a> has a playlist <a href="' + activity.item.uri + '">' + activity.item.name + '</a>';

        div.innerHTML = content;
        document.querySelector('#feed').appendChild(div);
    }
})(this);