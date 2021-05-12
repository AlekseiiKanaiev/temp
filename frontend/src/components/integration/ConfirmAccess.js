import React from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import Button from '@atlaskit/button';

const ContainerWrapper = styled.div`
  min-width: 650px;
  max-width: 650px;
  height: 300px;
  margin-top: 5%;
  margin-bottom: 5%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: block;
`;

const ContentWrapper = styled.div`
  margin-top: 10px;
  margin-left: 20px;
  margin-bottom: 30px;
  display: inline-block;
`;

const BottomTextWrapper = styled.p`
  margin-top: 30px;
  margin-left: 20px;
  color: #ccc;
`;

const ButtonWrapper = styled.span`
  float: right;
  margin-top: 10px;
  margin-right: 20px;
`;

const LinkWrapper = styled.a`
  color: rgb(107, 119, 140) !important;
`;

export default function ConfigrmAccess({ setStage, setGranted }) {
  return (
    <GridColumn medium={12}>
      <ContainerWrapper>
        <ContentWrapper>
          <h1>Confirm access to your account</h1>
          <p>
            <LinkWrapper href="https://snyk.auth0.com">Snyk</LinkWrapper>
            {' '}
            is requesting access to the following:
          </p>
          <h3>Read your account information</h3>
        </ContentWrapper>
        <BottomTextWrapper>
          This 3rd party vendor has not provided a privacy policy or terms of
          use. Atlassian's Privacy Policy is not applicable to the use of this
          App.
        </BottomTextWrapper>
        <ButtonWrapper>
          <Button
            onClick={() => {
              setStage(1);
              setGranted(true);
            }}
            appearance="primary"
          >
            Grant access
          </Button>
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            onClick={() => {
              setGranted(undefined);
            }}
          >
            Cancel
          </Button>
        </ButtonWrapper>
      </ContainerWrapper>
    </GridColumn>
  );
}
