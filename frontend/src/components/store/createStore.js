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
      jwtToken,
      username,
      currentUserId,
      repoOwner,
      repoSlug,
      repoMainBranch,
      workspaceSlug,
    },
    error: {},
    integration: {},
    projectsInfo: {},
    orgName: {},
  };

  return createStore(reducer, state);
}
