import React, {useEffect} from 'react';
import socketIOClient from 'socket.io-client';

const MeetingRoom = (props) => {
	let io = socketIOClient('https://web-rtc-gameserver.herokuapp.com/');
	let ROOM = 'my_ROOM';
    let SIGNALING_ROOM = 'my_SIGNALING_ROOM';
    
    // useEffect(()=>{
    //     document.getElementById('inputMessage').focus();
    //   },[])

	function displayMessage(message) {
        console.log(message);
	}

	const sendMessageFunction = e => {
        e.preventDefault();
		let input = document.getElementById('inputMessage').value;
		let myName = props.name;

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
			<p>Hello {props.name}! Please type your message and check the console.</p>
            <form onSubmit={sendMessageFunction}>
			<input type="text" placeholder="message" id="inputMessage" />
			<button type="submit" >SEND MESSAGE?</button>

            </form>
		</div>
	);
};

export default MeetingRoom;
