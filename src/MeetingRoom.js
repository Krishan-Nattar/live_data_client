import React, { useEffect, useState } from 'react';

const MeetingRoom = (props) => {
	const [xAxis, setXaxis] = useState(25);
	const [yAxis, setYaxis] = useState(25);
	const [otherXAxis, setOtherXaxis] = useState(25);
	const [otherYAxis, setOtherYaxis] = useState(25);
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
        
        document.addEventListener('keydown', sendMove);
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

	function moveOtherCharacter(direction) {
		if (direction === 'up') {
			// meowOn();

			setOtherYaxis((prev) => {
				return prev - 10;
			});
		} else if (direction === 'down') {
			setOtherYaxis((prev) => {
				return prev + 10;
			});
		} else if (direction === 'left') {
			setOtherXaxis((prev) => {
				return prev - 10;
			});
		} else if (direction === 'right') {
			setOtherXaxis((prev) => {
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
        if(direction.key){
            let key = direction.key;
            if(key === "w"){
                direction = "up"

            } else if(key === "a"){
                direction = "left"

            } else if(key === "s"){
                direction = "down"
            } else if(key === "d"){
                direction = "right";
            }
            moveOtherCharacter(direction);
			props.io.emit('move', {
				room: SIGNALING_ROOM,
				direction,
            });
            return;
        }
		if (
			direction === 'up' ||
			direction === 'down' ||
			direction === 'left' ||
			direction === 'right'
		) {
			moveOtherCharacter(direction);
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
		transition: '0.1s',
		position: 'absolute',
	};

	const otherStyle = {
		transform: `translate(${otherXAxis}px, ${otherYAxis}px)`,
		transition: '0.1s',
		position: 'absolute',
	};

	const messageStyle = {
        position: 'relative',
        // border: '1px solid black',
        width: '400px',
        margin: 'auto'
	};
	return (
		<div>
			<p>Hello {props.name}!</p>
			<form onSubmit={sendData}>
				<input type="text" placeholder="message" id="inputMessage" />
				<button type="submit">SEND MESSAGE?</button>
			</form>

			<button onClick={sendMove.bind(this, 'up')}>UP "w"</button>
			<button onClick={sendMove.bind(this, 'down')}>DOWN "s"</button>
			<button onClick={sendMove.bind(this, 'left')}>LEFT "a"</button>
			<button onClick={sendMove.bind(this, 'right')}>RIGHT "d"</button>

			<div className="messageContainer" style = {messageStyle}>
				<div style={style}>
					<img src="./cat.gif" />
					{catMessage && <p>"MEOW"</p>}
				</div>
				<div style={otherStyle}>
					<img src="./cat.gif" />
					{catMessage && <p>"MEOW"</p>}
				</div>
			</div>
		</div>
	);
};

export default MeetingRoom;
