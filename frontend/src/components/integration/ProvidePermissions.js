import React from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import Button from '@atlaskit/button';

const ContainerWrapper = styled.div`
  min-width: 650px;
  max-width: 650px;
  height: 400px;
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: block;
  text-align: center;
`;

const ImageWrapper = styled.span`
  vertical-align: middle;
`;

const ContentWrapper = styled.div`
  display: inline-block;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const BoldTextWrapper = styled.span`
  font-weight: bold;
`;

export default function ProvidePermissions({ setStage }) {
  return (
    <GridColumn medium={12}>
      <ContainerWrapper>
        <ContentWrapper>
          <ImageWrapper>
            <img
              src="/ico/Bitbucket-blue.svg"
              style={{ width: '150px' }}
              alt="Bitbucket ico"
            />
          </ImageWrapper>
          {' - - - - - '}
          <ImageWrapper>
            <img
              src="/ico/snykLogo.svg"
              style={{ width: '80px' }}
              alt="Snyk ico"
            />
          </ImageWrapper>
        </ContentWrapper>
        <p>
          <BoldTextWrapper>Bitbucket</BoldTextWrapper>
          {' '}
          wants to access your
          {' '}
          <BoldTextWrapper>Snyk</BoldTextWrapper>
          {' '}
          account.
        </p>
        <p>They will be able to:</p>
        <ul style={{ listStylePosition: 'inside' }}>
          <li>Execute a test on your behalf</li>
        </ul>
        <ContentWrapper>
          <Button onClick={() => setStage(2)} appearance="primary">
            Authorize Bitbucket
          </Button>
        </ContentWrapper>
      </ContainerWrapper>
    </GridColumn>
  );
}
