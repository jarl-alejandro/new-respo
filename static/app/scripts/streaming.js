'use strict'

import $ from  'jquery'

navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
)

function streamingTeacher(socket){

    const configuration = {'iceServers':[{'url': 'stun:stun.l.google.com:19302'}]}
    let type_user = document.querySelector("#type_user").value
    let tipo_usuario = null

    socket.emit("type::user", { "type_user":type_user })
    socket.emit("join::video::chat", { "channel":getChannel(), "type_user":type_user })
    socket.on("addPeer", start)

    socket.on("user::typo", function (data) {
        tipo_usuario = data.type_user
    })

    let local_media_stream = null;
    let peer_connection = null
    let peer_media_elements = {};
    let peers = {};

    navigator.getUserMedia({"audio":true, "video":true}, function (stream) {
        local_media_stream = stream;
        var local_media = $("<video>")
        local_media.attr("autoplay", "autoplay")
        local_media.attr("controls", "")
        local_media.attr("muted", "true");

        if(type_user == "Student"){
            local_media.addClass("estudianteLocalView")
            $('.LayoutRemoteEstudiante').append(local_media)
        }
        else{
            local_media.addClass("profesorLocalView")
            $('.LayoutRemoteProfesor').append(local_media)
        }
        attachMediaStream(local_media[0], local_media_stream)
    },
    function (err) {
        console.log(err)
    })

    function start (config) {
        let peer_id = config.peer_id
        let type_usuario = config.type_user

        if (peer_id in peers) {
            console.log("Already connected to peer ", peer_id);
            return;
        }

        peer_connection = new RTCPeerConnection(configuration, {"optional": [{"DtlsSrtpKeyAgreement": true}]} )
        peers[peer_id] = peer_connection

        peer_connection.onicecandidate = function (event) {
             if (event.candidate) {
                 console.log("ice candidate");
                 socket.emit("relayICECandidate", {
                     'peer_id': peer_id,
                     'ice_candidate': {
                         'sdpMLineIndex': event.candidate.sdpMLineIndex,
                         'candidate': event.candidate.candidate
                     }
                 })
             }
        }
        peer_connection.onaddstream = function (event) {
            var remote_media = $("<video>")
            remote_media.attr("autoplay", "autoplay")
            remote_media.attr("controls", "")

            peer_media_elements[peer_id] = remote_media
            if(tipo_usuario == "Student"){
                remote_media.addClass("estudianteRemoteView")
                $('.LayoutRemoteEstudiante').append(remote_media)
                attachMediaStream(remote_media[0], event.stream)
            }
            else{
                remote_media.addClass("profesorRemoteView")
                $('.LayoutRemoteProfesor').append(remote_media)
                attachMediaStream(remote_media[0], event.stream)
            }
        }

        peer_connection.addStream(local_media_stream)

        if(config.should_offer){

            peer_connection.createOffer(function (local_description) {
                peer_connection.setLocalDescription(local_description, function () {
                    socket.emit("relaySessionDescription", { 'peer_id': peer_id, 'session_description': local_description })
                },
                function () {
                    Alert("Offer setLocalDescription failed!");
                })
            },
            function (err) {
                console.log(err)
            })
        }// dein del if que valida el should_offer

    }

    socket.on("sessionDescription", function (config) {
        console.log('Remote description received: ', config);
        var peer_id = config.peer_id;
        var peer = peers[peer_id];
        var remote_description = config.session_description;
        console.log(config.session_description);

        var desc = new RTCSessionDescription(remote_description);
        var stuff = peer.setRemoteDescription(desc, function () {
            console.log("setRemoteDescription succeeded");

            if (remote_description.type == "offer") {
                console.log("Creating answer");
                peer.createAnswer(function (local_description) {
                    console.log("Answer description is: ", local_description)
                    peer.setLocalDescription(local_description, function (){
                        socket.emit('relaySessionDescription', { 'peer_id': peer_id, 'session_description': local_description });

                        console.log("Answer setLocalDescription succeeded");

                    }, function () {
                        Alert("Answer setLocalDescription failed!")
                    })

                }, function (err) {
                    console.log("Error creating answer: ", err)
                    console.log(peer)
                })
            }

        }, function (err) {
            console.log(err);
        })

        console.log("Description Object: ", desc)
    })

    socket.on("iceCandidate", function (config) {
        var peer = peers[config.peer_id];
        var ice_candidate = config.ice_candidate;
        peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
    })

    socket.on('disconnect', function() {
        for (peer_id in peer_media_elements)
            peer_media_elements[peer_id].remove();
        for (peer_id in peers)
            peers[peer_id].close()

        peers = {};
        peer_media_elements = {};
    })

    socket.on("removePeer", function (config) {
        var peer_id = config.peer_id
        if (peer_id in peer_media_elements)
            peer_media_elements[peer_id].remove()

        if (peer_id in peers)
            peers[peer_id].close()

        delete peers[peer_id]
        delete peer_media_elements[config.peer_id]
    })

}

function getChannel () {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1).length
    var channel = window.location.pathname.substring(pathName)
    return channel
}

export default streamingTeacher
