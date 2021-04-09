import React, { useState } from 'react';
import { GridColumn } from '@atlaskit/page';
import VulnerabilityBanner from './VulnerabilityBanner';
import ProjectTable from './projectTable/ProjectTable';
import ProjectIssues from './ProjectIssues';
import ProjectName from './projectTable/ProjectName';
import NoIssuesFound from './NoIssuesFound';

export default function ProjectList({ projects, jwtToken }) {
  const [projectId, setProjectId] = useState();

  const totalIssueCounts = (projects) => {
    let high = 0;
    let medium = 0;
    let low = 0;
    projects.forEach((project) => {
      high += project.issueCounts.high;
      medium += project.issueCounts.medium;
      low += project.issueCounts.low;
    });
    return { high, medium, low };
  };

  const project = projectId
    ? projects.find((project) => project.id === projectId)
    : undefined;

  const issueCounts = projectId
    ? totalIssueCounts([project])
    : totalIssueCounts(projects);

  const { low, high, medium } = issueCounts;

  const view = projectId ? (
    low + high + medium === 0 ? (
      <NoIssuesFound />
    ) : (
      <ProjectIssues projectId={projectId} jwtToken={jwtToken} />
    )
  ) : (
    <ProjectTable projects={projects} callback={setProjectId} />
  );

  return (
    <>
      <GridColumn medium={12}>
        <h3>
          Security insights
          {' '}
          {projectId && 'for '}
          {projectId && (
            <ProjectName
              name={project.name}
              type={project.type}
              callback={setProjectId}
            />
          )}
        </h3>
        <VulnerabilityBanner issueCounts={issueCounts} projectId={projectId} />
      </GridColumn>
      <GridColumn medium={12}>{view}</GridColumn>
    </>
  );
}
