import React from 'react';
import socketIOClient from 'socket.io-client';

const MeetingRoom = () => {
	let io = socketIOClient('https://web-rtc-gameserver.herokuapp.com/');
	let ROOM = 'my_ROOM';
	let SIGNALING_ROOM = 'my_SIGNALING_ROOM';

	function displayMessage(message) {
		console.log(message);
	}

	const sendMessageFunction = () => {
		let input = document.getElementById('inputMessage').value;
		let myName = document.getElementById('inputName').value;

		io.emit('send', {
			author: myName,
			message: input,
			room: SIGNALING_ROOM,
		});
	};

	io.emit('ready', {
		chat_room: ROOM,
		signaling_room: SIGNALING_ROOM,
		my_name: 'A new user',
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
			<input type="text" placeholder="message" id="inputMessage" />
			<input type="text" placeholder="Name" id="inputName" />
			<button onClick={sendMessageFunction}>SEND MESSAGE?</button>
		</div>
	);
};

export default MeetingRoom;
