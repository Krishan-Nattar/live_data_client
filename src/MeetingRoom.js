import React from 'react';
import socketIOClient from 'socket.io-client';

const MeetingRoom = (props) => {
	let io = socketIOClient('https://web-rtc-gameserver.herokuapp.com/');
	let ROOM = props.channel;
	let SIGNALING_ROOM = `${props.channel}z`;

	function processData(message, outsideSource = true) {
		let messageContainer = document.querySelector('.messageContainer');
		let newMessage = document.createElement('p');
		newMessage.textContent = message;
		if (outsideSource) {
			newMessage.style.color = 'blue';
		} else {
			newMessage.style.color = 'green';
		}
		messageContainer.appendChild(newMessage);
	}

	const sendData = (e) => {
		e.preventDefault();
		let input = document.getElementById('inputMessage').value;
		let myName = props.name;

		io.emit('send', {
			author: myName,
			message: input,
			room: SIGNALING_ROOM,
		});

		processData(myName + ': ' + input, false);
	};

	io.emit('ready', {
		chat_room: ROOM,
		signaling_room: SIGNALING_ROOM,
		my_name: props.name,
	});

	io.on('announce', (data) => {
		processData(data.message);
	});

	io.on('message', (data) => {
		processData(data.author + ': ' + data.message);
	});

	return (
		<div>
			<p>Hello {props.name}!</p>
			<form onSubmit={sendData}>
				<input type="text" placeholder="message" id="inputMessage" />
				<button type="submit">SEND MESSAGE?</button>
			</form>
			<div className="messageContainer"></div>
		</div>
	);
};

export default MeetingRoom;
