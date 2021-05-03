import React, { useLayoutEffect, useState } from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import ProjectList from './ProjectList';
import ProjectImport from './projectImport/ProjectImport';
import {
  getProjects,
  getSavedOrg,
  sendToAnalytics,
} from '../services/SnykService';
import Spinner from './Spinner';
import NoFilesDetected from './NoFilesDetected';
import ErrorPage from './ErrorPage';

const H1TextWrapper = styled.h1`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 24px;
  line-height: 28px;
`;

export default function SnykProjects({
  jwtToken,
  repoOwner,
  repoSlug,
  repoMainBranch,
  skipImportProjectPage,
}) {
  const [projects, setProjects] = useState();
  const [loading, setLoading] = useState(true);
  const [imported, setImported] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [errorsOnImport, setErrorsOnImport] = useState('');
  useLayoutEffect(() => {
    refreshProjects(false);
  }, [jwtToken]);

  const refreshProjects = (imported) => {
    getSavedOrg(jwtToken)
      .then((result) => {
        setOrgName(result.orgslug);
        getProjects(jwtToken, `${repoOwner}/${repoSlug}:`)
          .then((result) => {
            const projects = result.projects
              .filter((project) => project.name.startsWith(`${repoOwner}/${repoSlug}`))
              .map((project) => ({
                id: project.id,
                name: project.name,
                type: project.type,
                issueCounts: project.issueCountsBySeverity,
                testedAt: project.lastTestedDate,
              }));
            setProjects(projects);
            setLoading(false);
            setImported(imported);
            if (imported) {
              sendToAnalytics(jwtToken, {
                type: 'track',
                eventMessage: {
                  userId: '{snykuserid}',
                  event: 'connect_app_repo_imported',
                  properties: {
                    workspace_name: '{workspacename}',
                    workspace_id: '{workspaceid}',
                    bb_user_id: '{bbuserid}',
                    snyk_org_id: '{snykorgid}',
                    repo_slug: `${repoOwner}/${repoSlug}`,
                    import_result: 'success',
                    number_of_imported_projects: projects.length,
                  },
                },
              });
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const show = () => {
    if (loading) {
      return <Spinner />;
    }
    if (errorsOnImport) {
      return (
        <ErrorPage
          error={`Error importing this repository. ${errorsOnImport}`}
        />
      );
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
    }
    if (projects.length === 0 && imported) {
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
          <H1TextWrapper>Snyk</H1TextWrapper>
        </GridColumn>
        {show()}
      </Grid>
    </Page>
  );
}
