import React from 'react';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';
import { getApiToken } from '../../services/SnykService';

const SpinnerWrapper = styled.div`
    margin-top: 20%;
    display: flex;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
`;

let intervalObj;

export default function LogInSpinner({ jwtToken, setStage, setProcessingOauth }) {
  if (!intervalObj) {
    const interval = setInterval(() => {
      checkToken();
    }, 4000);
    intervalObj = interval;
  }

  const checkToken = () => {
    getApiToken(jwtToken)
      .then((result) => {
        if (result.token) {
          clearInterval(intervalObj);
          intervalObj = undefined;
          setProcessingOauth(false);
          setStage(1);
        }
      }).catch((err) => {
        clearInterval(intervalObj);
        intervalObj = undefined;
        setProcessingOauth(false);
        throw new Error(err);
      });
  };

  return (
    <SpinnerWrapper>
      <Spinner size="xlarge" />
    </SpinnerWrapper>
  );
}
