import React from 'react';
import MainPage from './MainPage';
import SnykIntegrationsSettings from '../integration/SnykIntegrationSettings';

function AccountPage() {
  return <MainPage context={<SnykIntegrationsSettings />} />;
}

export default AccountPage;