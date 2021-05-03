import React from 'react';
import ReactDOM from 'react-dom';
import AppAccount from './AppAccount';

export default function SnykAccountPage({
  jwtToken, username, currentuserid,
}) {
  return (
    <div>
      <AppAccount
        jwtToken={jwtToken}
        username={username}
        currentuserid={currentuserid}
      />
    </div>
  );
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  const jwtToken = document.getElementById('jwttoken').value;
  const username = document.getElementById('username').value;
  const currentuserid = document.getElementById('currentuserid').value;
  wrapper ? ReactDOM.render(
    <SnykAccountPage
      jwtToken={jwtToken}
      username={username}
      currentuserid={currentuserid}
    />,
    wrapper,
  ) : false;
});
