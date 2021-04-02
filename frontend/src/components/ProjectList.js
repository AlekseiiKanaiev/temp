import React from 'react';
import { GridColumn } from '@atlaskit/page';
import VulnerabilityBanner from './VulnerabilityBanner';
import ProjectTable from './projectTable/ProjectTable';

export default function ProjectList({ projects }) {
  const totalIssueCounts = (projectList) => {
    let high = 0;
    let medium = 0;
    let low = 0;
    projectList.forEach((project) => {
      high += project.issueCounts.high;
      medium += project.issueCounts.medium;
      low += project.issueCounts.low;
    });
    return { high, medium, low };
  };

  return (
    <>
      <GridColumn medium={12}>
        <h3>Security insights</h3>
        <VulnerabilityBanner issueCounts={totalIssueCounts(projects)} />
      </GridColumn>
      <GridColumn medium={12}>
        <ProjectTable projects={projects} />
      </GridColumn>
    </>
  );
}
