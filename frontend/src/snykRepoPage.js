import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import createStore from './components/store/createStore';
import { appRoutes } from './components/routing/Routes';

export default function SnykRepoPage({
  jwtToken,
  username,
  repoOwner,
  repoSlug,
  repoMainBranch,
  currentUserId,
  workspaceSlug,
}) {
  const store = createStore(
    jwtToken,
    username,
    currentUserId,
    repoOwner,
    repoSlug,
    repoMainBranch,
    workspaceSlug
  );

  return (
    <Provider store={store}>
      <App routes={appRoutes} />
    </Provider>
  );
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  const jwtToken = document.getElementById('jwttoken').value;
  const username = document.getElementById('username').value;
  const currentUserId = document.getElementById('currentuserid').value;
  const repoOwner = document.getElementById('repoOwner').value;
  const repoSlug = document.getElementById('repoSlug').value;
  const repoMainBranch = document.getElementById('repoMainBranch').value;
  const workspaceSlug = document.getElementById('workspaceSlug').value;
  ReactDOM.render(
        <SnykRepoPage
          jwtToken={jwtToken}
          username={username}
          repoOwner={repoOwner}
          repoSlug={repoSlug}
          repoMainBranch={repoMainBranch}
          currentUserId={currentUserId}
          workspaceSlug={workspaceSlug}
        />,
        wrapper
      )
});
