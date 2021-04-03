import React from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';

export default function NoIssuesFound() {
  const ImageWrapper = styled.div`
    margin-top: 50px;
    height: 400px;
    display: flex;
    justify-content: center;
  `;

  const ContentWrapper = styled.div`
    text-align: center;
  `;

  return (
    <GridColumn medium={12}>
      <ContentWrapper>
        <ImageWrapper>
          <img src="/ico/noIssues.png" alt="No issues found" />
        </ImageWrapper>
        <h1>All good, no issues found</h1>
      </ContentWrapper>
    </GridColumn>
  );
}
