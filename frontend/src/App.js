import React, { useState, useLayoutEffect } from 'react';
import SnykProjects from './components/SnykProjects';
import SnykIntegration from './components/integration/SnykIntegration';
import { getIntegration } from './services/SnykService';
import Spinner from './components/Spinner';

function App({ jwtToken }) {
  const [loading, setLoading] = useState(true);
  const [integrated, setIntegrated] = useState(false);
  useLayoutEffect(() => {
    checkIntegration();
  }, [jwtToken]);
  const checkIntegration = () => {
    getIntegration(jwtToken).then((result) => {
      if (result['bitbucket-cloud']) {
        setIntegrated(true);
      } else {
        setIntegrated(false);
      }
      setLoading(false);
    });
  };

  const view = () => {
    if (loading) {
      return <Spinner />;
    }
    if (integrated) {
      return <SnykProjects jwtToken={jwtToken} />;
    }
    return (
      <SnykIntegration jwtToken={jwtToken} callback={checkIntegration} />
    );
  };

  return view();
}

export default App;
