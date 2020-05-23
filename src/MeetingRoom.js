import React, { useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const MeetingRoom = (props) => {
	let io = socketIOClient('https://web-rtc-gameserver.herokuapp.com/');
	let ROOM = 'my_ROOM';
	let SIGNALING_ROOM = 'my_SIGNALING_ROOM';

	function displayMessage(message) {
		let messageContainer = document.querySelector('.messageContainer');
		let newMessage = document.createElement('p');
		newMessage.textContent = message;
		messageContainer.appendChild(newMessage);
	}

	const sendMessageFunction = (e) => {
		e.preventDefault();
		let input = document.getElementById('inputMessage').value;
		let myName = props.name;

		io.emit('send', {
			author: myName,
			message: input,
			room: SIGNALING_ROOM,
		});

		displayMessage(myName + ': ' + input);
	};

	io.emit('ready', {
		chat_room: ROOM,
		signaling_room: SIGNALING_ROOM,
		my_name: props.name,
	});

	io.on('announce', (data) => {
		displayMessage(data.message);
	});

	io.on('message', (data) => {
		displayMessage(data.author + ': ' + data.message);
	});

	return (
		<div>
			<p>Hello {props.name}!</p>
			<form onSubmit={sendMessageFunction}>
				<input type="text" placeholder="message" id="inputMessage" />
				<button type="submit">SEND MESSAGE?</button>
			</form>
			<div className="messageContainer"></div>
		</div>
	);
};

export default MeetingRoom;
