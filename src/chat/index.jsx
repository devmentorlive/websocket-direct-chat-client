import { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import './styles.css';

function Chat({ match }) {
  const socket = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
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

  function connect() {
    socket.current = new WebSocket('ws://127.0.0.1:3002');
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

  function onClose(e) {}

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
