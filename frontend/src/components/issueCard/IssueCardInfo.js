import React from 'react';
import styled from 'styled-components';
import Lozenge from '@atlaskit/lozenge';

export default function IssueCardInfo({ issue }) {
  const AdditionalInfoSpanBold = styled.span`
    vertical-align: top;
    margin-bottom: 10px;
    width: 150px;
    display: inline-block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 14px;
    line-height: 28px;
  `;

  const AdditionalInfoSpan = styled.span`
    vertical-align: top;
    margin-bottom: 10px;
    width: 250px;
    display: inline-block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 28px;
  `;

  return (
    <>
      <AdditionalInfoSpanBold>Vulnarable versions</AdditionalInfoSpanBold>
      <AdditionalInfoSpan>{issue.pkgVersions}</AdditionalInfoSpan>
      <AdditionalInfoSpanBold>Exploit maturity</AdditionalInfoSpanBold>
      <AdditionalInfoSpan>
        <Lozenge appearance="new">{issue.issueData.exploitMaturity}</Lozenge>
      </AdditionalInfoSpan>
      <AdditionalInfoSpanBold>Fixed in</AdditionalInfoSpanBold>
      <AdditionalInfoSpan>
        {issue.fixInfo.nearestFixedInVersion
          ? issue.fixInfo.nearestFixedInVersion
          : issue.fixInfo.fixedIn
            ? issue.fixInfo.fixedIn.join(', ')
            : ''}
      </AdditionalInfoSpan>
    </>
  );
}
