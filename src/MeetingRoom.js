import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const MeetingRoom = (props) => {
	let io = socketIOClient('https://web-rtc-gameserver.herokuapp.com/');
	let ROOM = 'my_ROOM';
	let SIGNALING_ROOM = 'my_SIGNALING_ROOM';
	let configuration = {
		iceServers: [
			{
				url: 'stun:stun.1.google.com:19302',
			},
		],
	};

	let rtcPeerConn;
	function onError(error) {
		console.log('Error!', error);
	}

	function startSignaling() {
		displaySignalingMessage('starting signaling...');

		rtcPeerConn = new RTCPeerConnection(configuration);
		// console.log(rtcPeerConn);
		// rtcPeerConn = new webkitRTCPeerConnection(configuration)

		rtcPeerConn.onicecandidate = function (event) {
			if (event.candidate) {
				io.emit('signal', {
					type: 'ice candidate',
					message: JSON.stringify({
						candidate: event.candidate,
						room: SIGNALING_ROOM,
					}),
				});
			}
			displaySignalingMessage('completed that ice candidate...');
		};

		rtcPeerConn.onnegotiationneeded = function () {
			displaySignalingMessage('on negotiation called');
			rtcPeerConn.createOffer(sendLocalDesc, logError);
		};

		// rtcPeerConn.onaddstream = function(event) {
		// 	console.log('on add stream');
		// 	displaySignalingMessage('going to add their stream...');
		//     document.querySelector('#theirVideoTag').srcObject = event.stream;
		//     console.log('')
		// };

		// navigator.mediaDevices.getUserMedia =
		// 	navigator.mediaDevices.getUserMedia ||
		// 	navigator.mediaDevices.webkitGetUserMedia ||
		// 	navigator.mediaDevices.mozGetUserMedia;
		// navigator.mediaDevices
		// 	.getUserMedia(constraints)
		// 	.then(stream => {
		// 		document.querySelector('#myVideoTag').srcObject = stream;
		// 		rtcPeerConn.addStream(stream);
		// 		document.querySelector('#myVideoTag').play();

		// 		// console.log("Success! We have a stream!");
		// 	})
		// 	.catch(onError);
	}

	function sendLocalDesc(desc) {
		rtcPeerConn.setLocalDescription(
			desc,
			function () {
				displaySignalingMessage('sending local description');
				io.emit('signal', {
					type: 'SDP',
					message: JSON.stringify({
						sdp: rtcPeerConn.localDescription,
					}),
					room: SIGNALING_ROOM,
				});
			},
			logError,
		);
	}

	function logError(error) {
		displaySignalingMessage(error.name + ': ' + error.message);
	}

	function displayMessage(message) {
		// let newMessage = message;
		// let charAmmount = 40
		// let amount = Math.floor(message.length/charAmmount);
		// if(amount > 0){
		// 	for(let i=amount; i>0; i--){
		// 		newMessage = newMessage.slice(0, i*charAmmount) + '-\r\n' + newMessage.slice(i*charAmmount);
		// 	}
		// }
		// document.querySelector('#chatArea').textContent += '\r\n' + newMessage;
		// document
		// 	.querySelector('#chatArea')
		// 	.setAttribute('style', 'white-space: pre;');
		// document.querySelector('#chatArea').scrollTop = 10000000;
		// chatArea.textContent = chatArea.textContent + "<br/>" + message;
		console.log(message);
	}
	function displaySignalingMessage(message) {
		console.log('SIGNALING MESSAGE', message);
		// console.log(message)
		// signalingArea.setAttribute('style', 'white-space: pre;');
		// signalingArea.textContent += '\r\n' + message;
	}

	const sendMessageFunction = () => {

        let input = document.getElementById('input1');
        
		
		
			displayMessage(
				`The message is ${input.value}`,
			);
			io.emit('send', {
				author: props.myName,
				message: input.value,
				room: SIGNALING_ROOM,
			});
		
		
	};

	io.emit('ready', {
		chat_room: ROOM,
		signaling_room: SIGNALING_ROOM,
		my_name: 'KRISHAN',
	});

	io.emit('signal', {
		type: 'user_here',
		message: 'Are you ready for a call?',
		room: SIGNALING_ROOM,
	});

	io.on('signaling_message', (data) => {
		displaySignalingMessage('Signal received: ' + data.message);
		if (!rtcPeerConn) {
			startSignaling();
		}

		if (data.type !== 'user_here') {
			var message = JSON.parse(data.message);
			if (message.sdp) {
				rtcPeerConn.setRemoteDescription(
					new RTCSessionDescription(message.sdp),
					function () {
						if (rtcPeerConn.remoteDescription.type === 'offer') {
							rtcPeerConn.createAnswer(sendLocalDesc, logError);
						}
					},
					logError,
				);
			} else {
				rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
			}
		}
	});

	io.on('announce', (data) => {
		displayMessage(data.message);
	});

	io.on('message', (data) => {
		displayMessage(data.author + ': ' + data.message);
	});

	return (
		<div>
			<p>Meeting ROom!</p>
            <input type="text" placeholder="message" id="input1" />
            <button onClick={sendMessageFunction}>SEND MESSAGE?</button>
		</div>
	);
};

export default MeetingRoom;
