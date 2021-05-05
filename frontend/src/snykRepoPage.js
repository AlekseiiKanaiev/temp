import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export default function SnykRepoPage({
  jwtToken,
  username,
  repoOwner,
  repoSlug,
  repoMainBranch,
  currentuserid,
  workspaceSlug,
}) {
  return (
    <div>
      <App
        jwtToken={jwtToken}
        username={username}
        repoOwner={repoOwner}
        repoSlug={repoSlug}
        repoMainBranch={repoMainBranch}
        currentuserid={currentuserid}
        workspaceSlug={workspaceSlug}
      />
    </div>
  );
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  const jwtToken = document.getElementById('jwttoken').value;
  const username = document.getElementById('username').value;
  const repoOwner = document.getElementById('repoOwner').value;
  const repoSlug = document.getElementById('repoSlug').value;
  const repoMainBranch = document.getElementById('repoMainBranch').value;
  const currentuserid = document.getElementById('currentuserid').value;
  const workspaceSlug = document.getElementById('workspaceSlug').value;
  wrapper ? ReactDOM.render(
    <SnykRepoPage
      jwtToken={jwtToken}
      username={username}
      repoOwner={repoOwner}
      repoSlug={repoSlug}
      repoMainBranch={repoMainBranch}
      currentuserid={currentuserid}
      workspaceSlug={workspaceSlug}
    />,
    wrapper,
  ) : false;
});
