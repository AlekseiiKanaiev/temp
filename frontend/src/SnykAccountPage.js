import React from 'react';
import ReactDOM from 'react-dom';
import AppAccount from './AppAccount';

export default function SnykAccountPage({
  jwtToken, workspace,
}) {
  return (
    <div>
      <AppAccount
        jwtToken={jwtToken}
        workspace={workspace}
      />
    </div>
  );
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  const jwtToken = document.getElementById('jwttoken').value;
  const workspace = document.getElementById('workspace').value;
  wrapper ? ReactDOM.render(
    <SnykAccountPage
      jwtToken={jwtToken}
      workspace={workspace}
    />,
    wrapper,
  ) : false;
});
