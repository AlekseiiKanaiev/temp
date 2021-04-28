import React from 'react';
import styled from 'styled-components';

export default function IssueCardAdditionalInfo({ issue, projectLink }) {
  const AdditionalTextWrapper = styled.p`
    margin: 20px;
    font-size: smaller;
  `;

  return (
    <>
      {projectLink && (
        <AdditionalTextWrapper>
          {'For additional information about this vulnerability and remediation options, '}
          <a
            href={projectLink}
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
