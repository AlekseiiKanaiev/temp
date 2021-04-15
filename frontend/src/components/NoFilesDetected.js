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

export default function NoFilesDetected() {
  return (
    <GridColumn medium={12}>
      <ContentWrapper>
        <ImageWrapper>
          <img src="/ico/notDetected.svg" alt="No files detected" />
        </ImageWrapper>
        <h2>No supported target files detected</h2>
        <p>
          Please visit our
          {' '}
          <a href="https://support.snyk.io/hc/en-us/articles/360016973477-Snyk-Code-language-and-framework-support">
            Knowledge Center
          </a>
          {' '}
          for supported languages and target files.
        </p>
      </ContentWrapper>
    </GridColumn>
  );
}
