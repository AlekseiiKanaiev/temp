import React from 'react';
import styled from 'styled-components';

export default function IssueCardAdditionalInfo({ projectLink }) {
  const AdditionalTextWrapper = styled.p`
    margin: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 24px;
  `;

  const LinkWrapper = styled.a`
  color: rgb(107, 119, 140) !important;
`;

  return (
    <>
      {projectLink && (
        <AdditionalTextWrapper>
          {
            'For additional information about this vulnerability and remediation options, '
          }
          <LinkWrapper href={projectLink} target="_blank" rel="noreferrer">
            visit Snyk
          </LinkWrapper>
        </AdditionalTextWrapper>
      )}
    </>
  );
}
