import React, { useState, useLayoutEffect } from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import { LoadingButton } from '@atlaskit/button';
import Textfield from '@atlaskit/textfield';
import { ErrorMessage } from '@atlaskit/form';
import { addIntegration } from '../../services/SnykService';
import Spinner from '../Spinner';

const ImageWrapper = styled.div`
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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
  font-size: small;
  display: block;
`;

const TextWrapper = styled.div`
  margin-left: 20px;
  margin-top: 30px;
`;

export default function IntegrateWithSnyk({
  jwtToken, callback, workspace, integrated,
}) {
  const [password, setPassword] = useState('');
  const [exception, setException] = useState('');
  const [loading, setLoading] = useState(false);
  const formLoadingInitialState = !!integrated;
  // console.log("a " + integrated)
  // console.log("a1 " + formLoadingInitialState)
  const [formLoading, setFormLoading] = useState(formLoadingInitialState);
  if (formLoading !== formLoadingInitialState) {
    setFormLoading(formLoadingInitialState);
  }

  useLayoutEffect(() => {
    if (integrated) {
      callback();
    }
  }, [jwtToken]);

  const requestIntegration = () => {
    setLoading(true);
    addIntegration(jwtToken, password, workspace).then((result) => {
      if (result.code) {
        setException(result.message);
      } else {
        callback();
      }
      setLoading(false);
    });
  };

  const view = () => {
  //  console.log(formLoading)
    if (formLoading) {
      return <Spinner />;
    }
    return (
      <>
        {' '}
        <GridColumn medium={12}>
          <ContainerWrapper>
            <Grid layout="fluid">
              <GridColumn medium={6}>
                <TextWrapper>
                  <h1>Integrate with Snyk</h1>
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
                <TextWrapper>
                  <Textfield
                    value={password}
                    placeholder="e.g. AXd0shyPTjjZnuMoD7C1"
                    onChange={(event) => {
                      setException('');
                      setPassword(event.target.value);
                    }}
                  />
                  {exception && <ErrorMessage>{exception}</ErrorMessage>}
                </TextWrapper>
              </GridColumn>
              <GridColumn medium={6}>
                <ImageWrapper>
                  <img src="/addAppPassword.png" alt="Add app password" />
                </ImageWrapper>
              </GridColumn>
              <GridColumn medium={12}>
                <ButtonWrapper>
                  <LoadingButton
                    isDisabled={!password}
                    appearance="primary"
                    onClick={() => requestIntegration()}
                    isLoading={loading}
                  >
                    Done
                  </LoadingButton>
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
