import React, { useState, useLayoutEffect } from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import Banner from '@atlaskit/banner';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import styled from 'styled-components';
import Button, { LoadingButton } from '@atlaskit/button';
import Textfield from '@atlaskit/textfield';
import {
  addIntegration,
  deleteOrg,
  getIntegrationId,
  checkAppPassword,
  sendToAnalytics,
  getOrganizations,
  deleteToken,
} from '../../services/SnykService';
import Spinner from '../Spinner';

const ImageWrapper = styled.img`
  margin-top: 60px;
  margin-left: 10px;
  height: 340px;
  width: 360px;
  display: flex;
  justify-content: center;
  border: 1px solid #ccc;
`;

const ContainerWrapper = styled.div`
  min-width: 780px;
  max-width: 780px;
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, 
              rgba(9, 30, 66, 0.31) 0px 0px 1px;
  display: block;
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 5px;
  float: right;
`;

const AdditionalTextWrapper = styled.div`
  min-width: 780px;
  max-width: 780px;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 20px;
  display: block;
`;

const TextWrapper = styled.div`
  margin-left: 20px;
  margin-top: 30px;
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
`;

const ButtonTextWrapper = styled.label`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

const BoldTextWrapper = styled.label`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
`;

const Icon = <ErrorIcon label="" secondaryColor="inherit" />;

export default function IntegrateWithSnyk({
  jwtToken, callback, username, workspaceSlug, repoSlug, currentUserId,
}) {
  const [password, setPassword] = useState('');
  const [usernamel, setUsername] = useState(username);
  const [exception, setException] = useState('');
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);

  useLayoutEffect(() => {
    getIntegrationId(jwtToken)
      .then((res) => {
        if (res.id) {
          callback(true);
        } else {
          setFormLoading(false);
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [jwtToken]);

  const requestIntegration = () => {
    setLoading(true);
    checkAppPassword(jwtToken, usernamel, password, workspaceSlug, repoSlug)
      .then((result) => {
        if (result.error) {
          setException(result.message);
          setLoading(false);
          sendToAnalytics(jwtToken, {
            type: 'track',
            eventMessage: {
              event: 'connect_app_integration_created',
              properties: {
                bb_user_id: currentUserId,
                result: 'error',
                error_message: result.message,
              },
            },
          });
        } else {
          addIntegration(jwtToken, password, usernamel)
            .then((result) => {
              if (result.error || result.code) {
                setException(result.message);
                sendToAnalytics(jwtToken, {
                  type: 'track',
                  eventMessage: {
                    event: 'connect_app_integration_created',
                    properties: {
                      bb_user_id: currentUserId,
                      result: 'error',
                      error_message: result.message,
                    },
                  },
                });
              } else {
                sendToAnalytics(jwtToken, {
                  type: 'track',
                  eventMessage: {
                    event: 'connect_app_integration_created',
                    properties: {
                      bb_user_id: currentUserId,
                      result: 'success',
                    },
                  },
                });
                callback(true);
              }
              setLoading(false);
            });
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const backButton = () => {
    getOrganizations(jwtToken).then((result) => {
      deleteOrg(jwtToken).then(() => {
        if (result.orgs.length === 1) {
          deleteToken(jwtToken)
            .then(() => callback(true));
        } else {
          callback(true);
        }
      });
    }).catch((err) => {
      throw new Error(err);
    });
  };

  const view = () => {
    if (formLoading) {
      return (
        <GridColumn medium={12}>
          <Spinner />
        </GridColumn>
      );
    }
    return (
      <>
        {' '}

        <GridColumn medium={12}>
          {exception && (
            <ContainerWrapper>
              <Banner icon={Icon} isOpen={exception} appearance="error">
                {exception}
              </Banner>
            </ContainerWrapper>
          )}
          <ContainerWrapper>
            <Grid layout="fluid">
              <GridColumn medium={6}>
                <TextWrapper>
                  <H1TextWrapper>Integrate with Snyk</H1TextWrapper>
                </TextWrapper>
                <TextWrapper>
                  In order to scan your code for vulnerabilities, you'll need to
                  integrate Snyk to your account so it could access your repos.
                </TextWrapper>
                <TextWrapper>Please follow these steps:</TextWrapper>
                <TextWrapper>
                  <ul style={{ listStyleType: 'decimal' }}>
                    <li>
                      <p>
                        <a
                          href="https://bitbucket.org/account/settings/app-passwords/new"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Create an App Password
                        </a>
                        {' '}
                        within your personal Bitbucket account
                        {' '}
                      </p>
                    </li>
                    <li>
                      <p>Provide a label for the new App Password</p>
                    </li>
                    <li>
                      <p>Check the permissions, as appears in the screenshot</p>
                    </li>
                    <li>
                      <p>
                        Click on
                        {' '}
                        <span style={{ fontWeight: 'bold' }}>Create</span>
                        {' '}
                        and
                        paste the generated app Password
                        {' '}
                      </p>
                    </li>
                  </ul>
                </TextWrapper>
                {!username && (
                  <TextWrapper>
                    <BoldTextWrapper>
                      Username (can be found in
                      {' '}
                      <a
                        href="https://bitbucket.org/account/settings/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Personal Settings
                      </a>
                      )
                    </BoldTextWrapper>
                    <Textfield
                      value={usernamel}
                      placeholder="e.g. JoeBlogs"
                      onChange={(event) => {
                        setException('');
                        setUsername(event.target.value);
                      }}
                    />
                  </TextWrapper>
                )}
                <TextWrapper>
                  <BoldTextWrapper>App Password</BoldTextWrapper>
                  <Textfield
                    type="password"
                    value={password}
                    placeholder="e.g. AXd0shyPTjjZnuMoD7C1"
                    onChange={(event) => {
                      setException('');
                      setPassword(event.target.value);
                    }}
                  />
                </TextWrapper>
              </GridColumn>
              <GridColumn medium={6}>
                <ImageWrapper
                  src="/addAppPassword.png"
                  alt="Add app password"
                />
              </GridColumn>
              <GridColumn medium={12}>
                <ButtonWrapper>
                  <LoadingButton
                    isDisabled={!(password && usernamel)}
                    appearance="primary"
                    onClick={() => requestIntegration()}
                    isLoading={loading}
                  >
                    <ButtonTextWrapper>Done</ButtonTextWrapper>
                  </LoadingButton>
                </ButtonWrapper>
                <ButtonWrapper>
                  <Button
                    appearance="subtle-link"
                    onClick={() => {
                      backButton();
                    }}
                  >
                    <ButtonTextWrapper>Back</ButtonTextWrapper>
                  </Button>
                </ButtonWrapper>
              </GridColumn>
            </Grid>
          </ContainerWrapper>
        </GridColumn>
        <GridColumn medium={12}>
          <AdditionalTextWrapper>
            To learn more about our permissions requirements, visit the
            {' '}
            <a
              href="https://support.snyk.io/hc/en-us/articles/360004032097-Bitbucket-Cloud-integration"
              target="_blank"
              rel="noreferrer"
            >
              Knowledge Center
            </a>
            .
          </AdditionalTextWrapper>
        </GridColumn>
      </>
    );
  };

  return view();
}
