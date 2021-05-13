import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import { setProjects } from '../store/actions';

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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

const H1TextWrapper = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
  margin-top: 30px !important;
`;

const LinkWrapper = styled.a`
  color: rgb(0, 82, 204) !important;
`;

export default function NoFilesDetected() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(setProjects({}));
  });

  return (
    <Page>
      <Grid layout="fluid">
        <GridColumn medium={12}>
          <GridColumn medium={12}>
            <H1TextWrapper>Snyk</H1TextWrapper>
          </GridColumn>
          <ContentWrapper>
            <ImageWrapper>
              <img src="/ico/notDetected.svg" alt="No files detected" />
            </ImageWrapper>
            <H1TextWrapper>No supported target files detected</H1TextWrapper>
            <TextWrapper>
              Please visit our
              {' '}
              <LinkWrapper href="https://support.snyk.io/hc/en-us/articles/360016973477-Snyk-Code-language-and-framework-support">
                Knowledge Center
                {' '}
              </LinkWrapper>
              {' '}
              for supported languages and target files.
            </TextWrapper>
          </ContentWrapper>
        </GridColumn>
      </Grid>
    </Page>
  );
}
