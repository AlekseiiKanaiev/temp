import React from 'react';
import styled from 'styled-components';
import Lozenge from '@atlaskit/lozenge';

export default function IssueCardBadge({ issue }) {
  const PackageNameWrapper = styled.span`
    margin-left: 5px;
    font-weight: bold;
  `;

  const badge = () => {
    const data = issue.issueData.severity.toUpperCase();
    switch (issue.issueData.severity) {
      case 'low':
        return <Lozenge isBold>{data}</Lozenge>;
      case 'medium':
        return (
          <Lozenge appearance="moved" isBold>
            {data}
          </Lozenge>
        );
      case 'high':
        return (
          <Lozenge appearance="removed" isBold>
            {data}
          </Lozenge>
        );
      default:
        return <Lozenge>{data}</Lozenge>;
    }
  };

  return (
    <>
      {badge()}
      {' '}
      <PackageNameWrapper>{issue.pkgName}</PackageNameWrapper>
      {` - ${issue.issueData.title}`}
    </>
  );
}
