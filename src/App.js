import React, { useState, useEffect } from 'react';
import './App.css';
import MeetingRoom from './MeetingRoom';

function App(props) {

  useEffect(()=>{
    document.getElementById('inputName').focus();
  },[])

  let [name, setName] = useState('');
  let [channel, setChannel] = useState('');
	let [show, setShow] = useState(false);

	const handleNameChange = (e) => {
		setName(e.target.value);
  };
  
  const handleChannelChange = (e) => {
		setChannel(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (name !== '' && channel !== '') {
			setShow(true);
		}
  };
	return (
		<div className="App">
			{!show && (
        <>
			{/* <p>Please enter your name</p> */}
      <br />
				<form>
					<input
						type="text"
						placeholder="Name"
						onChange={handleNameChange}
            value={name}
            id="inputName"
					/>
          <br />
          <input
						type="text"
						placeholder="Channel Name"
						onChange={handleChannelChange}
            value={channel}
					/>
          <br />
					<button type="submit" onClick={handleSubmit}>
						OK
					</button>
				</form>
        </>
			)}
			{show && <MeetingRoom name={name} channel={channel} io={props.io}/>}
		</div>
	);
}

export default App;
