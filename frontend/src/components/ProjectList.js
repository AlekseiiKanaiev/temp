import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import VulnerabilityBanner from './VulnerabilityBanner';
import ProjectTable from './projectTable/ProjectTable';
import ProjectIssues from './ProjectIssues';
import ProjectName from './projectTable/ProjectName';
import NoIssuesFound from './NoIssuesFound';

const ContainerWrapper = styled.div`
  margin-top: 5%;
  margin-left: 20px;
`;

const H1TextWrapper = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 28px;
`;

export default function ProjectList({ projects, orgname }) {
  const [projectId, setProjectId] = useState();
  const [baseUrl, setBaseUrl] = useState();

  const {
    jwtToken, repoSlug, repoOwner, currentUserId,
  } = useSelector(
    (state) => state.configuration,
  );

  useEffect(() => {
    AP.getLocation((location) => {
      const url = new URL(location);
      setBaseUrl(url.href.replace(url.search, ''));
      const id = url.searchParams.get('projectId');
      if (id) {
        setProjectId(id);
      }
    });
  });

  const totalIssueCounts = (projects) => {
    let high = 0;
    let medium = 0;
    let low = 0;
    let critical = undefined;
    if (projects) {
      projects.forEach((project) => {
        high += project.issueCounts.high;
        medium += project.issueCounts.medium;
        low += project.issueCounts.low;
        if (project.issueCounts.critical) {
          critical = critical ? critical + project.issueCounts.critical : project.issueCounts.critical
        }
      });
    }
    return { high, medium, low, critical };
  };

  const project = projectId
    ? projects.find((project) => project.id === projectId)
    : undefined;

  const issueCounts = projectId
    ? totalIssueCounts([project])
    : totalIssueCounts(projects);

  const { low, high, medium, critical } = issueCounts;

  const view = projectId ? (
    low + high + medium + critical === 0 ? (
      <NoIssuesFound />
    ) : (
      <ProjectIssues
        projectId={projectId}
        jwtToken={jwtToken}
        repoOwner={repoOwner}
        repoSlug={repoSlug}
        currentUserId={currentUserId}
        projectLink={`https://app.snyk.io/org/${orgname}/project/${projectId}`}
        projectName={project.name.substring(project.name.indexOf(':') + 1)}
      />
    )
  ) : (
    <ProjectTable projects={projects} baseUrl={baseUrl} />
  );

  return (
    <>
      <GridColumn medium={12}>
        <ContainerWrapper>
          <H1TextWrapper>
            {!projectId && 'Security insights '}
            {projectId && (
              <ProjectName
                name={project.name}
                type={project.type}
                baseUrl={baseUrl}
                repoSlug={repoSlug}
              />
            )}
          </H1TextWrapper>
          <VulnerabilityBanner
            issueCounts={issueCounts}
            projectId={projectId}
            projectLink={`https://app.snyk.io/org/${orgname}/project/${projectId}`}
          />
        </ContainerWrapper>
      </GridColumn>
      <GridColumn medium={12}>{view}</GridColumn>
    </>
  );
}
