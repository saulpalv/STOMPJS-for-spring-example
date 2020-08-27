import React from 'react';
import './App.css';
import { Button } from '@material-ui/core';
import { Client, Message } from '@stomp/stompjs';

var client = null

class App2 extends React.Component {

  constructor(props) {
    super(props);
    console.log('constructed')
  }

  connect() {

    client = new Client();
    client.brokerURL = "ws://127.0.0.1:8080/gs-guide-websocket/websocket";

    console.log(client.brokerURL);

    client.onConnect = (frame) => {
      // Do something, all subscribes must be done is this callback
      // This is needed because this will be executed after a (re)connect
      console.log('Connected: ' + frame);
      var subscription = client.subscribe('/topic/greetings', (greeting) => {
        console.log('recived : ', JSON.parse(greeting.body).content);
      });
    };
    client.activate();
    //client.publish({ destination: '/app/hello', body: JSON.stringify({ 'name': "Names" }) });
  }

  componentDidMount() {
    console.log('initialized')
    this.connect();
  }

  componentWillUnmount() {
    this.disconnect();
  }

  disconnect() {
    if (client !== null) {
      client.disconnect();
      console.log("disconnected")
    }
  }

  render() {
    return (
      <div>
        <Button variant="contained" color="primary" disableElevation
          onClick={() => {
            client.publish({ destination: '/app/hello', body: JSON.stringify({ 'name': "Names" }) });
          }}>Hello World</Button>
      </div>
    );
  }
}


export default App2;
