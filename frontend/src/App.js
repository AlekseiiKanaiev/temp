import React, { useLayoutEffect, useState } from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import ProjectList from './components/ProjectList';
import ProjectImport from './components/projectImport/ProjectImport';
import { getProjects } from './services/SnykService';
import Spinner from './components/Spinner';

function App({ jwtToken }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    getProjects(jwtToken).then((result) => {
      setProjects(
        result.projects.map((project) => ({
          id: project.id,
          name: project.name,
          type: project.type,
          issueCounts: project.issueCountsBySeverity,
          testedAt: project.lastTestedDate,
        })),
      );
      setLoading(false);
    });
  }, []);

  const element = projects.length === 0 ? (
    <ProjectImport jwtToken={jwtToken} />
  ) : (
    <ProjectList projects={projects} jwtToken={jwtToken} />
  );

  const show = loading ? <Spinner /> : element;

  return (
    <Page>
      <Grid layout="fluid">
        <GridColumn medium={12}>
          <h1>Snyk</h1>
        </GridColumn>
        {show}
      </Grid>
    </Page>
  );
}

export default App;
