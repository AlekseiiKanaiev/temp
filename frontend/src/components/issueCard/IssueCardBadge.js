import React from 'react';
import styled from 'styled-components';
import Lozenge from '@atlaskit/lozenge';

const PackageNameWrapper = styled.span`
  margin-left: 5px;
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 18px;
  line-height: 24px;
`;

const PackageDescWrapper = styled.label`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 18px;
  line-height: 24px;
`;

export default function IssueCardBadge({ issue }) {
  const badge = () => {
    const data = issue.issueData.severity.toUpperCase();
    switch (issue.issueData.severity) {
      case 'low':
        return <Lozenge isBold>{data}</Lozenge>;
      case 'medium':
        return (
          <Lozenge appearance='moved' isBold>
            {data}
          </Lozenge>
        );
      case 'high':
        return (
          <Lozenge appearance='removed' isBold>
            {data}
          </Lozenge>
        );
      default:
        return <Lozenge>{data}</Lozenge>;
    }
  };

  return (
    <>
      {badge()} <PackageNameWrapper>{issue.pkgName}</PackageNameWrapper>
      <PackageDescWrapper>{` - ${issue.issueData.title}`}</PackageDescWrapper>
    </>
  );
}
