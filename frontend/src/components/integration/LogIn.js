import React, { useLayoutEffect } from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import {
  getNewState,
  sendToAnalytics,
} from '../../services/SnykService';

const ContainerWrapper = styled.div`
  min-width: 650px;
  max-width: 650px;
  height: 300px;
  margin-top: 5%;
  margin-bottom: 5%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
    rgba(9, 30, 66, 0.31) 0px 0px 1px;
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 30px;
`;

const MainTextWrapper = styled.label`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
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
    const windowReference = window.open();
    getNewState(jwtToken, currentUserId).then((result) => {
      const href = `https://app.snyk.io/oauth/authorize?response_type=code&client_id=${result.clientid}&state=${result.token}&redirect_uri=${result.url}&scope=offline_access&audience=https://api.snyk.io&utm_campaign=Bitbucket-Cloud-Connect-App&utm_medium=Partner&utm_source=Atlassian&utm_content=Native-integration`;
      windowReference.location = href;
    });
    setProcessingOauth(true);
  };
  useLayoutEffect(() => {
    sendToAnalytics(jwtToken, {
      type: 'track',
      eventMessage: {
        event: 'connect_app_page_view',
        properties: {
          bb_user_id: currentUserId,
          viewed_page: 'sign_up',
        },
      },
    });
  });

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
