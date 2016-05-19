'use strict'

// import viewvideoTemplate from './templates/viewvideo.hbs'
// import domify from 'domify'

navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
)

function streamingTeacher(socket){
    var configuration = {'iceServers':[{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]}
    const remoteView = document.querySelector("#remoteView")
    const selfView = document.querySelector("#selfView")
    const startClass = document.getElementById('startClass')
    let localVideoStream = null;
    let peerConn = null;

    startClass.addEventListener("click", initCall, false)

    // endCall.addEventListener("click", endCall)
    socket.on("onwebrtc::message", onMessageEvent)

    function onError(err) {
        console.log(err);
    }

    function prepareCall() {
        peerConn = new RTCPeerConnection(configuration)
        peerConn.onicecandidate = onIceCandidateHandler
        peerConn.onaddstream = onAddStreamHandler
    }

    function initCall() {
        prepareCall()

        navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
            localVideoStream = stream
            selfView.src = URL.createObjectURL(localVideoStream)
            peerConn.addStream(localVideoStream)
            createAndSendOffer()
        }, onError)
    }

    function onMessageEvent (evt) {
        let signal = null
        signal = evt
        console.log("on message")

        if (!peerConn){
            answerCall()
        }
        if (signal.sdp) {
            peerConn.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        }
        else if (signal.candidate){
            peerConn.addIceCandidate(new RTCIceCandidate(signal.candidate))
        }
    }
    function answerCall () {
        prepareCall()

        navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
            localVideoStream = stream
            selfView.src = URL.createObjectURL(localVideoStream)
            peerConn.addStream(localVideoStream)
            createAndSendAnswer()
        }, onError)
    }

    function createAndSendOffer() {
        peerConn.createOffer(function (offer) {
            let off = new RTCSessionDescription(offer)
            peerConn.setLocalDescription(off, function () {
                socket.emit("onwebrtc", { sdp:off })
            },
            onError)
        },
        onError)
    }

    function createAndSendAnswer () {
        peerConn.createAnswer(function (answer) {
            let ans = new RTCSessionDescription(answer)
            peerConn.setLocalDescription(ans, function () {
                socket.emit("onwebrtc", {"sdp": ans })
            },
            onError)
        },
        onError)
    }

    function onIceCandidateHandler (evt) {
        if (!evt || !evt.candidate) return;
        socket.emit("onwebrtc", { "candidate": evt.candidate })
    }

    function onAddStreamHandler (evt) {
        console.log("vista");
        remoteView.src = URL.createObjectURL(evt.stream);
    }

    function endCall () {
        peerConn.close()
        peerConn = null
        localVideoStream.getTracks().forEach(function (track) {
            track.stop()
        })
        remoteView.src = ""
        selfView.src = ""
    }

}


export default streamingTeacher
