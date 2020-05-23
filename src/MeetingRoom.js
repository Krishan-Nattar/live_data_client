import React, { useEffect, useState } from 'react';

const MeetingRoom = (props) => {
    const [xAxis, setXaxis] = useState(25);
	const [yAxis, setYaxis] = useState(25);
	const [catMessage, setCatMessage] = useState(false);
	useEffect(() => {
		props.io.emit('ready', {
			chat_room: ROOM,
			signaling_room: SIGNALING_ROOM,
			my_name: props.name,
		});

		props.io.on('announce', (data) => {
			processData(data.message);
		});

		props.io.on('message', (data) => {
			processData(data.author + ': ' + data.message);
		});

		props.io.on('move', (data) => {
			moveCharacter(data.direction);
		});
	}, []);

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

	function moveCharacter(direction) {
		if (direction === 'up') {
			// meowOn();

			setYaxis((prev) => {
				return prev - 10;
			});
		} else if (direction === 'down') {
			setYaxis((prev) => {
				return prev + 10;
			});
		} else if (direction === 'left') {
			setXaxis((prev) => {
				return prev - 10;
			});
		} else if (direction === 'right') {
			setXaxis((prev) => {
				return prev + 10;
			});
		}
	}
	function meowOff() {
		setCatMessage(false);
	}
	function meowOn() {
		setCatMessage(true);
		setTimeout(meowOff, 3000);
	}

	function sendMove(direction) {

		if (
			direction === 'up' ||
			direction === 'down' ||
			direction === 'left' ||
			direction === 'right'
		) {
			props.io.emit('move', {
				room: SIGNALING_ROOM,
				direction,
			});
		}
	}

	function sendData(e) {
		e.preventDefault();
		let input = document.getElementById('inputMessage').value;
		let myName = props.name;

		props.io.emit('send', {
			author: myName,
			message: input,
			room: SIGNALING_ROOM,
		});

		processData(myName + ': ' + input, false);
	}

	const style = {
		transform: `translate(${xAxis}px, ${yAxis}px)`,
	};

	return (
		<div>
			<div style={style}>
				<img src="./cat.gif" />
				{catMessage && <p>"MEOW"</p>}
			</div>
			<p>Hello {props.name}!</p>
			<form onSubmit={sendData}>
				<input type="text" placeholder="message" id="inputMessage" />
				<button type="submit">SEND MESSAGE?</button>
			</form>

			<button onClick={sendMove.bind(this, 'up')}>UP</button>
			<button onClick={sendMove.bind(this, 'down')}>DOWN</button>
			<button onClick={sendMove.bind(this, 'left')}>LEFT</button>
			<button onClick={sendMove.bind(this, 'right')}>RIGHT</button>

			<div className="messageContainer"></div>
		</div>
	);
};

export default MeetingRoom;
