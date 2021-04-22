import React from 'react';
import ReactDOM from 'react-dom';
import AppAccount from './AppAccount';

export default function SnykAccountPage({
  jwtToken, username
}) {
  return (
    <div>
      <AppAccount
        jwtToken={jwtToken}
        username={username}
      />
    </div>
  );
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  const jwtToken = document.getElementById('jwttoken').value;
  const username = document.getElementById('username').value;
  wrapper ? ReactDOM.render(
    <SnykAccountPage
      jwtToken={jwtToken}
      username={username}
    />,
    wrapper,
  ) : false;
});
