import React from 'react';
import ReactDOM from 'react-dom';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';

const ContainerWrapper = styled.div`
  min-width: 650px;
  max-width: 650px;
  height: 200px;
  margin-top: 150px;
  margin-bottom: 5%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: block;
  text-align: center;
`;

const ContentWrapper = styled.div`
  margin-top: 70px;
  display: inline-block;
`;

const H1TextWrapper = styled.h1`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
`;

const TextWrapper = styled.p`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
  margin-top: 10px;
`;

export default function SuccessfullyAuthorized() {
  return (
    <Page>
      <Grid layout='fluid'>
        <GridColumn medium={12}>
          <ContainerWrapper>
            <ContentWrapper>
              <H1TextWrapper>
                You successfully authorized Bitbucket
              </H1TextWrapper>
              <TextWrapper>
                Please close this tab and follow the next integration steps.
              </TextWrapper>
            </ContentWrapper>
          </ContainerWrapper>
        </GridColumn>
      </Grid>
    </Page>
  );
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  ReactDOM.render(
        <SuccessfullyAuthorized/>,
        wrapper
      )
});