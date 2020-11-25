import { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from '../login';
import Chat from '../chat';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <Login />
        </Route>
        <Route path='/chat/:recipientId'>
          <Chat />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
