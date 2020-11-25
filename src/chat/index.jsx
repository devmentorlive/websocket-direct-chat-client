import { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import useWebsocket from './use-websocket';
import './styles.css';

function Chat({ match }) {
  const {
    socket,
    reconnecting,
    messages,
    setMessages,
  } = useWebsocket({
    url: 'ws://127.0.0.1:3002',
    onConnected,
  });
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState(undefined);

  const user = JSON.parse(localStorage.getItem('user'));

  const { recipientId } = match.params;

  useEffect(() => {
    fetch(`http://127.0.0.1:3001/users/${recipientId}`)
      .then((res) => res.json())
      .then((json) => setRecipient(json));

    fetch(`http://127.0.0.1:3001/chats/${recipientId}/${user._id}`)
      .then((res) => res.json())
      .then((json) =>
        setMessages(
          json.map((message) => {
            return {
              type: 'say',
              ...message,
            };
          }),
        ),
      );
  }, []);

  function onConnected(socket) {
    socket.send(
      JSON.stringify({
        type: 'connect',
        userId: user._id,
      }),
    );
  }

  function sendMessage(e) {
    e.preventDefault();
    socket.send(
      JSON.stringify({
        type: 'say',
        sender: user._id,
        recipient: recipient._id,
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
                {m.sender === user._id ? 'You' : recipient.name}:{' '}
                {m.text}
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
      {recipient && <div>Chatting with {recipient.name}</div>}
    </form>
  );
}

export default withRouter(Chat);
