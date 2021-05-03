import React from 'react';
import styled from 'styled-components';

export default function IssueCardAdditionalInfo({ projectLink }) {
  const AdditionalTextWrapper = styled.p`
    margin: 20px;
    font-family: 'Open Sans';
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    line-height: 24px;
  `;

  return (
    <>
      {projectLink && (
        <AdditionalTextWrapper>
          {
            'For additional information about this vulnerability and remediation options, '
          }
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
