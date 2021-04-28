import React from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';

const ImageWrapper = styled.div`
  margin-top: 50px;
  height: 300px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  text-align: center;
`;

const TextWrapper = styled.p`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

const H1TextWrapper = styled.h1`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
`;

export default function NoFilesDetected() {
  return (
    <GridColumn medium={12}>
      <ContentWrapper>
        <ImageWrapper>
          <img src='/ico/notDetected.svg' alt='No files detected' />
        </ImageWrapper>
        <H1TextWrapper>No supported target files detected</H1TextWrapper>
        <TextWrapper>
          Please visit our{' '}
          <a href='https://support.snyk.io/hc/en-us/articles/360016973477-Snyk-Code-language-and-framework-support'>
            Knowledge Center
          </a>{' '}
          for supported languages and target files.
        </TextWrapper>
      </ContentWrapper>
    </GridColumn>
  );
}
