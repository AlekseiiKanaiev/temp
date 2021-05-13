import React from 'react';
import styled from 'styled-components';
import { SimpleTag as Tag } from '@atlaskit/tag';

const PackageNameWrapper = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 14px;
  line-height: 24px;
  margin-left: -5px;
`;

const PackageDescWrapper = styled.label`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 24px;
`;

const LabelWrapper = styled.label`
  width: 52px;
  display: block;
  text-align: center;
  text-transform: capitalize;
`;

export default function IssueCardBadge({ issue }) {
  const badge = () => {
    const data = <LabelWrapper>{issue.issueData.severity}</LabelWrapper>;
    switch (issue.issueData.severity) {
      case 'low':
        return <Tag color='grey' text={data} />;
      case 'medium':
        return <Tag color='yellow' text={data} />;
      case 'high':
        return <Tag color='redLight' text={data} />;
      default:
        return <Tag color='grey' text={data} />;
    }
  };

  return (
    <>
      <PackageNameWrapper>
        {badge()}
        {` ${issue.pkgName}`}
      </PackageNameWrapper>
      <PackageDescWrapper>{` - ${issue.issueData.title}`}</PackageDescWrapper>
    </>
  );
}