import React from 'react';
import MainPage from './MainPage';
import SnykProjects from '../SnykProjects';

function RepoPage() {
  return <MainPage context={<SnykProjects />} />;
}

export default RepoPage;
