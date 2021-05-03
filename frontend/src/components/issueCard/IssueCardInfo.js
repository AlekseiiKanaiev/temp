import React from 'react';
import styled from 'styled-components';
import Lozenge from '@atlaskit/lozenge';

export default function IssueCardInfo({ issue }) {
  const AdditionalInfoParentSpan = styled.span`
    margin-top: 10px;
    margin-bottom: 10px;
    width: 50%;
    display: inline-block;
    font-family: 'Open Sans';
    font-weight: 600;
    font-style: normal;
    font-size: 14px;
    line-height: 28px;
  `;

  const AdditionalInfoChildSpan = styled.span`
    margin-right: 30%;
    float: right;
    font-family: 'Open Sans';
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 28px;
  `;

  return (
    <>
      <AdditionalInfoParentSpan>
        Vulnarable versions
        <AdditionalInfoChildSpan>{issue.pkgVersions}</AdditionalInfoChildSpan>
      </AdditionalInfoParentSpan>
      <AdditionalInfoParentSpan>
        Exploit maturity
        <AdditionalInfoChildSpan>
          <Lozenge appearance="new">{issue.issueData.exploitMaturity}</Lozenge>
        </AdditionalInfoChildSpan>
      </AdditionalInfoParentSpan>
      <AdditionalInfoParentSpan>
        Fixed in
        <AdditionalInfoChildSpan>
          {issue.fixInfo.nearestFixedInVersion
            ? issue.fixInfo.nearestFixedInVersion
            : issue.fixInfo.fixedIn
              ? issue.fixInfo.fixedIn.join(',')
              : ''}
        </AdditionalInfoChildSpan>
      </AdditionalInfoParentSpan>
    </>
  );
}
