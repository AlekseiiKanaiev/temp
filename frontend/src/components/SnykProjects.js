import React, { useLayoutEffect, useState } from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import ProjectList from './ProjectList';
import ProjectImport from './projectImport/ProjectImport';
import { getProjects } from '../services/SnykService';
import ImportRepositorySpinner from './ImportRepositorySpinner';
import NoFilesDetected from './NoFilesDetected';

export default function SnykProjects({ jwtToken }) {
  const [projects, setProjects] = useState();
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
  }, [jwtToken]);

  const show = () => {
    if (loading) {
      return <ImportRepositorySpinner />;
    }
    if (!projects) {
      return <ProjectImport jwtToken={jwtToken} />;
    } if (projects.length === 0) {
      return <NoFilesDetected />;
    }
    return <ProjectList projects={projects} jwtToken={jwtToken} />;
  };

  return (
    <Page>
      <Grid layout="fluid">
        <GridColumn medium={12}>
          <h1>Snyk</h1>
        </GridColumn>
        {show()}
      </Grid>
    </Page>
  );
}
