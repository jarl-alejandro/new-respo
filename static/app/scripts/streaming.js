'use strict'

import $ from  'jquery'

navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
)

function streamingTeacher(socket){
    document.querySelector("#startClass").style = "display:none"

    const configuration = {'iceServers':[{'url': 'stun:stun.l.google.com:19302'}]}
    const selfView = document.querySelector("#selfView")

    socket.emit("join::video::chat", { "channel":getChannel() })
    socket.on("addPeer", start)

    let local_media_stream = null;
    let peer_connection = null
    let peer_media_elements = {};
    let peers = {};

    navigator.getUserMedia({"audio":true, "video":true}, function (stream) {
        local_media_stream = stream;
        selfView.src = URL.createObjectURL(local_media_stream)
    },
    function (err) {
        console.log(err)
    })

    function start (config) {
        let peer_id = config.peer_id

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
            $('.containerVideoRemote').append(remote_media)
            attachMediaStream(remote_media[0], event.stream)
        }

        peer_connection.addStream(local_media_stream)

        alert(config.should_offer)

        if(config.should_offer){
            alert("dentro del if")
            alert(peer_id)

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
