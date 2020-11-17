import { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import useWebsocket from './use-websocket';
import './styles.css';

function Chat({ match }) {
  const { socket, readyState, reconnecting, messages } = useWebsocket(
    {
      url: 'ws://127.0.0.1:3002',
      onConnected,
    },
  );
  const [message, setMessage] = useState('');

  const user = localStorage.getItem('userId');

  function onConnected(socket) {
    socket.send(
      JSON.stringify({
        type: 'connect',
        user,
      }),
    );
  }

  function sendMessage(e) {
    const { recipient } = match.params;
    e.preventDefault();
    socket.send(
      JSON.stringify({
        type: 'say',
        sender: user,
        recipient,
        text: message,
      }),
    );
    setMessage('');
  }

  return reconnecting ? (
    <div>reconnecting!</div>
  ) : (
    <form onSubmit={sendMessage}>
      <div className='chat'>
        <div className='inner'>
          {messages
            .filter((m) => m.type === 'say')
            .map((m, i) => (
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
