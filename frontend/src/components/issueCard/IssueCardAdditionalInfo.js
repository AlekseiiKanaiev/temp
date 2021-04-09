import React from 'react';
import styled from 'styled-components';

export default function IssueCardAdditionalInfo({ issue }) {
  const AdditionalTextWrapper = styled.p`
    margin: 20px;
    font-size: smaller;
  `;

  return (
    <>
      {issue.issueData.url && (
        <AdditionalTextWrapper>
          {'For additional information about this vulnerability and remediation options, '}
          <a
            href={issue.issueData.url}
            target="_blank"
            rel="noreferrer"
            style={{ fontWeight: 'bold' }}
          >
            visit Snyk
          </a>
        </AdditionalTextWrapper>
      )}
    </>
  );
}
