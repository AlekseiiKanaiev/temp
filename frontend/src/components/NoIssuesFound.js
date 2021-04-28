import React from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';

const ImageWrapper = styled.div`
  margin-top: 50px;
  height: 400px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  text-align: center;
`;

const H1TextWrapper = styled.h1`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
`;

export default function NoIssuesFound() {
  return (
    <GridColumn medium={12}>
      <ContentWrapper>
        <ImageWrapper>
          <img src='/ico/noIssues.svg' alt='No issues found' />
        </ImageWrapper>
        <H1TextWrapper>All good, no issues found</H1TextWrapper>
      </ContentWrapper>
    </GridColumn>
  );
}
