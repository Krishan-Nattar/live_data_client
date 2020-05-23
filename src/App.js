import React, { useState, useEffect } from 'react';
import './App.css';
import MeetingRoom from './MeetingRoom';

function App() {

  useEffect(()=>{
    document.getElementById('inputName').focus();
  },[])

	let [name, setName] = useState('');
	let [show, setShow] = useState(false);

	const handleChange = (e) => {
		setName(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (name !== '') {
			setShow(true);
		}
	};
	return (
		<div className="App">
			{!show && (
        <>
			<p>Please enter your name</p>
				<form>
					<input
						type="text"
						placeholder="Name"
						onChange={handleChange}
            value={name}
            id="inputName"
					/>
					<button type="submit" onClick={handleSubmit}>
						OK
					</button>
				</form>
        </>
			)}
			{show && <MeetingRoom name={name} />}
		</div>
	);
}

export default App;
