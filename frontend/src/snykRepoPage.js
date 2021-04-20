import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export default function SnykRepoPage({
  jwtToken, workspace, repoOwner, repoSlug, repoMainBranch,
}) {
  return (
    <div>
      <App
        jwtToken={jwtToken}
        workspace={workspace}
        repoOwner={repoOwner}
        repoSlug={repoSlug}
        repoMainBranch={repoMainBranch}
      />
    </div>
  );
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  const jwtToken = document.getElementById('jwttoken').value;
  const workspace = document.getElementById('workspace').value;
  const repoOwner = document.getElementById('repoOwner').value;
  const repoSlug = document.getElementById('repoSlug').value;
  const repoMainBranch = document.getElementById('repoMainBranch').value;
  wrapper ? ReactDOM.render(
    <SnykRepoPage
      jwtToken={jwtToken}
      workspace={workspace}
      repoOwner={repoOwner}
      repoSlug={repoSlug}
      repoMainBranch={repoMainBranch}
    />,
    wrapper,
  ) : false;
});
