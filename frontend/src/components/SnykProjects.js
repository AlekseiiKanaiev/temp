import React, { useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-resource-router';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import { dispatchProjects } from './store/dispatchers';
import ProjectList from './ProjectList';
import ProjectImport from './projectImport/ProjectImport';
import Spinner from './Spinner';

const H1TextWrapper = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 24px;
  line-height: 28px;
`;

export default function SnykProjects() {
  const configuration = useSelector((state) => state.configuration);
  const {
    jwtToken,
  } = configuration;
  const { error } = useSelector((state) => state.error);
  const { projects, imported } = useSelector((state) => state.projectsInfo);
  const orgName = useSelector((state) => state.orgName);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (jwtToken) {
      dispatchProjects(dispatch, configuration, false);
    }
  }, [jwtToken]);

  const show = () => {
    if (error) {
      return <Redirect to="/error" push />;
    }
    if (!orgName || projects === undefined) {
      return (
        <GridColumn medium={12}>
          <Spinner />
        </GridColumn>
      );
    }
    if (projects.length === 0 && !imported) {
      return <ProjectImport />;
    }
    if (projects.length === 0 && imported) {
      return <Redirect to="/noFilesDetected" push />;
    }
    return <ProjectList projects={projects} orgname={orgName} />;
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
