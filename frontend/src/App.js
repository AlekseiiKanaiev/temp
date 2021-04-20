import React, { useState, useLayoutEffect } from 'react';
import SnykProjects from './components/SnykProjects';
import SnykIntegration from './components/integration/SnykIntegration';
import { getIntegrationTokenOrg } from './services/SnykService';
import Spinner from './components/Spinner';

function App({
  jwtToken, workspace, repoOwner, repoSlug, repoMainBranch,
}) {
  const [loading, setLoading] = useState(true);
  const [integrationParams, setIntegrationParams] = useState({ integrated: false, token: false, org: false });
  useLayoutEffect(() => {
    checkIntegration();
  }, [jwtToken]);
  const checkIntegration = () => {
    getIntegrationTokenOrg(jwtToken).then((result) => {
      setIntegrationParams({ integrated: result.integrated, token: result.token, org: result.org });
      setLoading(false);
    });
  };

  const view = () => {
    if (loading) {
      return <Spinner />;
    }
    if (integrationParams.integrated && integrationParams.token && integrationParams.org) {
      return (
        <SnykProjects
          jwtToken={jwtToken}
          repoOwner={repoOwner}
          repoSlug={repoSlug}
          repoMainBranch={repoMainBranch}
        />
      );
    }
    return (
      <SnykIntegration
        jwtToken={jwtToken}
        callback={checkIntegration}
        workspace={workspace}
        integrationParams={integrationParams}
      />
    );
  };

  return view();
}

export default App;
