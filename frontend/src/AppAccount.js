import React, { useState, useLayoutEffect } from 'react';
import SnykIntegrationsSettings from './components/integration/SnykIntegrationSettings';
import SnykIntegration from './components/integration/SnykIntegration';
import { getIntegrationTokenOrg, restartIntegration } from './services/SnykService';
import Spinner from './components/Spinner';

function AppAccount({ jwtToken, username }) {
  const [loading, setLoading] = useState(true);
  const [integrationParams, setIntegrationParams] = useState({ integrated: false, token: false, org: false });

  useLayoutEffect(() => {
    checkIntegration(false);
  }, [jwtToken]);
  const checkIntegration = (skipImportProjectPage) => {
    getIntegrationTokenOrg(jwtToken).then((result) => {
      setIntegrationParams({ integrated: result.integrated, token: result.token, org: result.org });
      setLoading(false);
    }).catch((err) => {
      throw new Error(err);
    });
  };

  const snykSettingsCallback = () => {
    restartIntegration(jwtToken)
      .then(() => checkIntegration())
      .catch((err) => {
        throw new Error(err);
      });
  };

  const view = () => {
    if (loading) {
      return <Spinner />;
    }
    if (integrationParams.integrated && integrationParams.token && integrationParams.org) {
      return (
        <SnykIntegrationsSettings jwtToken={jwtToken} callback={snykSettingsCallback} />
      );
    }
    return (
      <SnykIntegration jwtToken={jwtToken} callback={checkIntegration} username={username} integrationParams={integrationParams} />
    );
  };

  return view();
}

export default AppAccount;
