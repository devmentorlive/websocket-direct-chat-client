import { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import './styles.css';

function Chat({ match }) {
  const socket = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [reconnectInterval, setReconnectInterval] = useState(null);
  const [intervalHandle, setIntervalHandle] = useState(null);
  const user = localStorage.getItem('userId');

  useEffect(() => {
    connect();

    socket.current.onopen = onOpen;
    socket.current.onclose = onClose;
    socket.current.onmessage = onMessage;

    return () => {
      socket.current.close();
    };
  }, []);

  useEffect(() => {
    setReconnectInterval(2000);
    return () => window.clearInterval(intervalHandle);
  }, []);

  useEffect(() => {
    if (reconnectInterval === null) {
      window.clearInterval(intervalHandle);
    } else {
      setIntervalHandle(
        window.setInterval(() => {
          connect();
          console.log('reconnecting...');
        }, reconnectInterval),
      );
    }
  }, [reconnectInterval]);

  function connect() {
    socket.current = new WebSocket('ws://127.0.0.1:3002');
    setReconnectInterval(null);
  }

  function onOpen(e) {
    console.log('socket ready state', socket.current.readyState);
    socket.current.send(
      JSON.stringify({
        type: 'connect',
        user,
      }),
    );
  }

  function onClose(e) {
    setReconnectInterval(2000);
  }

  function onMessage(e) {
    const data = JSON.parse(e.data);
    switch (data.type) {
      case 'say':
        setMessages((prev) => [...prev, data]);
        break;
      default:
        break;
    }
  }

  function sendMessage(e) {
    const { recipient } = match.params;
    e.preventDefault();
    socket.current.send(
      JSON.stringify({
        type: 'say',
        sender: user,
        recipient,
        text: message,
      }),
    );
    setMessage('');
  }

  return (
    <form onSubmit={sendMessage}>
      <div className='chat'>
        <div className='inner'>
          {messages.map((m, i) => (
            <div key={i} className='message'>
              {m.sender === user ? 'You' : m.sender}: {m.text}
            </div>
          ))}
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input type='submit' value='Send' />
        </div>
      </div>
    </form>
  );
}

export default withRouter(Chat);
