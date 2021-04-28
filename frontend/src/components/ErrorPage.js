import React from 'react';
import Grid, { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';

export default function ErrorPage({ error }) {
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
    <Grid layout="fluid">
      <GridColumn medium={12}>
        <ContentWrapper>
          <ImageWrapper>
            <img src="/ico/errorImporting.svg" alt="error importing" />
          </ImageWrapper>
          <h1>{error}</h1>
          <p>
            Please try again later or
            {' '}
            <a href="https://snyk.io/contact-us/" target="_blank" rel="noreferrer">contact our support</a>
          </p>
        </ContentWrapper>
      </GridColumn>
    </Grid>
  );
}
