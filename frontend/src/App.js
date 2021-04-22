import React, { useState, useLayoutEffect } from 'react';
import SnykProjects from './components/SnykProjects';
import SnykIntegration from './components/integration/SnykIntegration';
import { getIntegrationTokenOrg } from './services/SnykService';
import Spinner from './components/Spinner';

function App({
  jwtToken, username, repoOwner, repoSlug, repoMainBranch,
}) {
  const [loading, setLoading] = useState(true);
  const [skipImportProjectPage, setSkipImportProjectPage] = useState(false);
  const [integrationParams, setIntegrationParams] = useState({ integrated: false, token: false, org: false });

  useLayoutEffect(() => {
    checkIntegration(false);
  }, [jwtToken]);
  const checkIntegration = (skipImportProjectPage) => {
    setSkipImportProjectPage(skipImportProjectPage)
    getIntegrationTokenOrg(jwtToken).then((result) => {
      setIntegrationParams({ integrated: result.integrated, token: result.token, org: result.org });
      setLoading(false);
    }).catch((err) => {
      throw new Error(err)
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
          skipImportProjectPage={skipImportProjectPage}
        />
      );
    }
    return (
      <SnykIntegration
        jwtToken={jwtToken}
        callback={checkIntegration}
        username={username}
        integrationParams={integrationParams}
      />
    );
  };

  return view();
}

export default App;
