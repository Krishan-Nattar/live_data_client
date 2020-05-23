import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import socketIOClient from 'socket.io-client';

let io = socketIOClient('https://web-rtc-gameserver.herokuapp.com/');
ReactDOM.render(
  
  <React.StrictMode>
    <App io={io}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
