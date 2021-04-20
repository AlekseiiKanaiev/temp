import React from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { getNewState } from '../../services/SnykService';

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
  text-align: center;
`;

const ContentWrapper = styled.div`
  margin-top: 70px;
  display: inline-block;
`;
const ButtonWrapper = styled.div`
  margin-top: 50px;
  margin-bottom: 100px;
`;

export default function LogIn({ setProcessingOauth, jwtToken }) {
  const logIn = () => {
    getNewState(jwtToken)
      .then((result) => {
        const href = `https://id.snyk.io/authorize?response_type=code&client_id=${result.clientid}&state=${result.token}&redirect_uri=${result.url}&scope=offline_access&audience=https://api.snyk.io`;
        window.open(href, '_blank');
      });
    setProcessingOauth(true);
  };

  return (
    <GridColumn medium={12}>
      <ContainerWrapper>
        <ContentWrapper>
          <h1>Log in or sign up to Snyk</h1>
          <p>
            To secure your repositories, you need to first have a Snyk account.
          </p>
          <p>It's quick and easy.</p>
          <ButtonWrapper>
            <Button onClick={() => logIn()} appearance="primary">
              Log in or sign up to Snyk
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </ContainerWrapper>
    </GridColumn>
  );
}
