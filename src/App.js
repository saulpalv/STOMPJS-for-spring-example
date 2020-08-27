import React from 'react';
import './App.css';
import { Button } from '@material-ui/core';

var Stomp = require('stompjs');
const SockJS = require('sockjs-client');

var stompClient = null;

class App extends React.Component {

  constructor(props) {
    super(props);
    console.log('constructed')
  }

  connect() {
    var socket = new SockJS('http://localhost:8080/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      stompClient.subscribe('/topic/greetings', (greeting) => {
        console.log('recived : ', JSON.parse(greeting.body).content);
      });
    });
  }

  componentDidMount() {
    console.log('initialized')
    this.connect();
  }

  componentWillUnmount() {
    if (stompClient !== null) {
      stompClient.disconnect();
      console.log("disconnected")
    }
  }

  disconnect() {
    if (stompClient !== null) {
      stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  render() {
    return (
      <div>
        <Button variant="contained" color="primary" disableElevation
          onClick={() => { stompClient.send("/app/hello", {}, JSON.stringify({ 'name': "Optimus" })); }}>Hello World</Button>
      </div>
    );
  }
}


export default App;
