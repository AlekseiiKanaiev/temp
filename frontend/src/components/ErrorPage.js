import React from 'react';
import Grid, { GridColumn } from '@atlaskit/page';
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

export default function ErrorPage({ error }) {
  return (
    <Grid layout="fluid">
      <GridColumn medium={12}>
        <ContentWrapper>
          <ImageWrapper>
            <img src="/ico/errorImporting.svg" alt="error importing" />
          </ImageWrapper>
          <H1TextWrapper>{error}</H1TextWrapper>
          <TextWrapper>
            Please try again later or
            {' '}
            <a
              href="https://snyk.io/contact-us/"
              target="_blank"
              rel="noreferrer"
            >
              contact our support
            </a>
          </TextWrapper>
        </ContentWrapper>
      </GridColumn>
    </Grid>
  );
}
