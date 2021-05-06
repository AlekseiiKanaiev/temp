import { createStore } from 'redux';
import reducer from './reducer';

export default function configureStore(
  jwtToken,
  username,
  currentUserId,
  repoOwner,
  repoSlug,
  repoMainBranch,
  workspaceSlug,
) {
  const state = {
    configuration: {
      jwtToken: jwtToken,
      username: username,
      currentUserId: currentUserId,
      repoOwner: repoOwner,
      repoSlug: repoSlug,
      repoMainBranch: repoMainBranch,
      workspaceSlug :workspaceSlug,
    },
    error: {},
    integration: {},
    projectsInfo: {},
    orgName: {},
  };

  return createStore(reducer, state);
}