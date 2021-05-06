import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import createStore from './components/store/createStore';
import { accountRoutes } from './components/routing/Routes';

export default function SnykAccountPage({ 
  jwtToken, 
  username, 
  currentUserId, }) {
  const store = createStore(jwtToken, username, currentUserId);
  return (
    <Provider store={store}>
      <App routes={accountRoutes} />
    </Provider>
  );
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  const jwtToken = document.getElementById('jwttoken').value;
  const username = document.getElementById('username').value;
  const currentUserId = document.getElementById('currentuserid').value;
  ReactDOM.render(
    <SnykAccountPage
      jwtToken={jwtToken}
      username={username}
      currentUserId={currentUserId}
    />,
    wrapper,
  )
});
