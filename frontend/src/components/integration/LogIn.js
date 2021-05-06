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

const H1TextWrapper = styled.h1`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 30px;
`;

const MainTextWrapper = styled.label`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

export default function LogIn({
  setProcessingOauth,
  jwtToken,
  currentUserId,
}) {
  const logIn = () => {
    getNewState(jwtToken, currentUserId).then((result) => {
      const href = `https://id.snyk.io/authorize?response_type=code&client_id=${result.clientid}&state=${result.token}&redirect_uri=${result.url}&scope=offline_access&audience=https://api.snyk.io&utm_campaign=Bitbucket-connect-promotion&utm_medium=Partner&utm_source=Bitbucket`;
      window.open(href, '_blank');
    });
    setProcessingOauth(true);
  };

  return (
    <GridColumn medium={12}>
      <ContainerWrapper>
        <ContentWrapper>
          <H1TextWrapper>Log in or sign up to Snyk</H1TextWrapper>
          <p>
            <MainTextWrapper>
              To secure your repositories, you need to first have a Snyk
              account.
            </MainTextWrapper>
          </p>
          <p>
            <MainTextWrapper>It's quick and easy.</MainTextWrapper>
          </p>
          <ButtonWrapper>
            <Button onClick={() => logIn()} appearance="primary">
              <MainTextWrapper>Log in or sign up to Snyk</MainTextWrapper>
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </ContainerWrapper>
    </GridColumn>
  );
}
