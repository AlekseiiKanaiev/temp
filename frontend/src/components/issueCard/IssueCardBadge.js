import React from 'react';
import styled from 'styled-components';
import { SimpleTag as Tag } from '@atlaskit/tag';
import SnykTag from '../SnykTag';

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

export default function IssueCardBadge({ issue }) {
  return (
    <>
      <PackageNameWrapper>
        <SnykTag
          color={issue.issueData.severity}
          text={issue.issueData.severity}
          width='55px'
        />
        {` ${issue.pkgName}`}
      </PackageNameWrapper>
      <PackageDescWrapper>{` - ${issue.issueData.title}`}</PackageDescWrapper>
    </>
  );
}