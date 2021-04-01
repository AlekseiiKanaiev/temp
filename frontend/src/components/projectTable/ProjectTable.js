import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';

import ProjectName from './ProjectName';
import VulnarabilityBadges from '../VulnarabilityBadges';

const TableWrapper = styled.div`
  margin-top: 30px;
`;

const TextWrapper = styled.span`
  font-size: small;
`;

const head = {
  cells: [
    {
      key: 'project',
      content: 'Project',
      width: 60,
    },
    {
      key: 'vulnerabilities',
      content: 'Vulnerabilities',
      width: 25,
    },
    {
      key: 'additional',
      content: '',
      width: 25,
    },
  ],
};

const rows = (projects) => projects.map((project) => ({
  key: `row-${project.id}`,
  cells: [
    {
      key: project.name,
      content: <ProjectName name={project.name} type={project.type} />,
    },
    {
      key: project.name,
      content: <VulnarabilityBadges issueCounts={project.issueCounts} />,
    },
    {
      key: project.name,
      content: (
        <TextWrapper>{getTestedMessage(project.testedAt)}</TextWrapper>
      ),
    },
  ],
}));

const getTestedMessage = (testedAt) => {
  const hours = moment().diff(moment(testedAt), 'hours');
  if (hours > 24 * 365) {
    return `Tested ${Math.floor(hours / 24 / 365)} years ago`;
  } if (hours > 24) {
    return `Tested ${Math.floor(hours / 24)} days ago`;
  }
  return `Tested ${hours} hours ago`;
};

export default function ProjectTable({ projects }) {
  return (
    <TableWrapper>
      <DynamicTable
        head={head}
        rows={rows(projects)}
        isLoading={!projects}
        loadingSpinnerSize="large"
      />
    </TableWrapper>
  );
}
