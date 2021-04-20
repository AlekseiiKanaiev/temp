import React from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';

export default function ErrorImporting() {
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
          <img src="/ico/errorImporting.svg" alt="error importing" />
        </ImageWrapper>
        <h1>Error importing this repository</h1>
        <p>
          Please try again later or
          {' '}
          <a href="https://snyk.io/contact-us/">contact our support</a>
        </p>
      </ContentWrapper>
    </GridColumn>
  );
}
