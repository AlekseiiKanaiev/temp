import React, { useLayoutEffect, useState } from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import ProjectList from './ProjectList';
import ProjectImport from './projectImport/ProjectImport';
import { getProjects, getSavedOrg } from '../services/SnykService';
import Spinner from './Spinner';
import NoFilesDetected from './NoFilesDetected';
import ErrorPage from './ErrorPage';

export default function SnykProjects({
  jwtToken, repoOwner, repoSlug, repoMainBranch, skipImportProjectPage,
}) {
  const [projects, setProjects] = useState();
  const [loading, setLoading] = useState(true);
  const [imported, setImported] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [errorsOnImport, setErrorsOnImport] = useState(false);
  useLayoutEffect(() => {
    refreshProjects(false);
  }, [jwtToken]);

  const refreshProjects = (imported) => {
    getSavedOrg(jwtToken).then((result) => {
      setOrgName(result.orgslug);
      getProjects(jwtToken, `${repoOwner}/${repoSlug}:`).then((result) => {
        setProjects(result.projects.filter((project) => project.name.startsWith(`${repoOwner}/${repoSlug}`)).map((project) => ({
          id: project.id,
          name: project.name,
          type: project.type,
          issueCounts: project.issueCountsBySeverity,
          testedAt: project.lastTestedDate,
        })));
        setLoading(false);
        setImported(imported);
      }).catch((err) => {
        throw new Error(err);
      });
    }).catch((err) => {
      throw new Error(err);
    });
  };

  const show = () => {
    if (loading) {
      return <Spinner />;
    }
    if (errorsOnImport) {
      return (<ErrorPage error="Error importing this repository" />);
    }
    if (projects.length === 0 && !imported) {
      return (
        <ProjectImport
          jwtToken={jwtToken}
          repoOwner={repoOwner}
          repoSlug={repoSlug}
          repoMainBranch={repoMainBranch}
          refreshProjects={refreshProjects}
          setErrorsOnImport={setErrorsOnImport}
          skipImportProjectPage={skipImportProjectPage}
        />
      );
    } if (projects.length === 0 && imported) {
      return <NoFilesDetected />;
    }
    return (
      <ProjectList
        projects={projects}
        jwtToken={jwtToken}
        orgname={orgName}
        repoSlug={repoSlug}
      />
    );
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
