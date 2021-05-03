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
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
`;

const NameWrapper = styled.span`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

const TableHeaderWrapper = styled.label`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
`;

const head = {
  cells: [
    {
      key: 'project',
      content: <TableHeaderWrapper>Project</TableHeaderWrapper>,
      width: 60,
    },
    {
      key: 'vulnerabilities',
      content: <TableHeaderWrapper>Vulnerabilities</TableHeaderWrapper>,
      width: 25,
    },
    {
      key: 'additional',
      content: '',
      width: 25,
    },
  ],
};

const rows = (projects, callback) => projects.map((project) => ({
  key: `row-${project.id}`,
  cells: [
    {
      key: project.name,
      content: (
        <NameWrapper>
          <ProjectName
            name={project.name}
            type={project.type}
            id={project.id}
            callback={callback}
            repoSlug={undefined}
          />
        </NameWrapper>
      ),
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
  }
  if (hours > 24) {
    return `Tested ${Math.floor(hours / 24)} days ago`;
  }
  return `Tested ${hours} hours ago`;
};

export default function ProjectTable({ projects, callback }) {
  return (
    <TableWrapper>
      <DynamicTable
        head={head}
        rows={rows(projects, callback)}
        isLoading={!projects}
        loadingSpinnerSize="large"
      />
    </TableWrapper>
  );
}
