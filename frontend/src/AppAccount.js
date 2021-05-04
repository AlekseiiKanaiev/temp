import React, { useState, useLayoutEffect } from 'react';
import SnykIntegrationsSettings from './components/integration/SnykIntegrationSettings';
import SnykIntegration from './components/integration/SnykIntegration';
import { getIntegrationTokenOrg, restartIntegration } from './services/SnykService';
import Spinner from './components/Spinner';
import ErrorPage from './components/ErrorPage';

function AppAccount({ jwtToken, username, currentuserid }) {
  const [loading, setLoading] = useState(true);
  const [integrationParams, setIntegrationParams] = useState({
    integrated: false,
    token: false,
    org: false,
  });
  const [error, setError] = useState('');
  useLayoutEffect(() => {
    checkIntegration(false);
  }, [jwtToken]);
  const checkIntegration = (skipImportProjectPage) => {
    getIntegrationTokenOrg(jwtToken).then((result) => {
      if (result.error) {
        setError(result.message);
      }
      setIntegrationParams({ integrated: result.integrated, token: result.token, org: result.org });
      setLoading(false);
    }).catch((err) => {
      throw new Error(err);
    });
  };

  const snykSettingsCallback = () => {
    restartIntegration(jwtToken, currentuserid)
      .then(() => checkIntegration())
      .catch((err) => {
        throw new Error(err);
      });
  };

  const view = () => {
    if (loading) {
      return <Spinner />;
    }
    if (error) {
      return <ErrorPage error={error} />;
    }
    if (integrationParams.integrated && integrationParams.token && integrationParams.org) {
      return (
        <SnykIntegrationsSettings
          jwtToken={jwtToken}
          callback={snykSettingsCallback}
        />
      );
    }
    return (
      <SnykIntegration
        jwtToken={jwtToken}
        callback={checkIntegration}
        username={username}
        integrationParams={integrationParams}
        currentuserid={currentuserid}
      />
    );
  };

  return view();
}

export default AppAccount;
