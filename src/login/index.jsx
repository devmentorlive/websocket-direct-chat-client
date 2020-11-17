import { useState } from 'react';
import { withRouter } from 'react-router-dom';

function Login({ history }) {
  const [name, setName] = useState('');
  return (
    <div>
      <input
        type='text'
        placeholder='What is your name?'
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={() => {
          localStorage.setItem('userId', name);
        }}>
        Ready?
      </button>
    </div>
  );
}

export default withRouter(Login);
