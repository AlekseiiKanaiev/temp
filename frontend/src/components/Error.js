import React from 'react';
import { ErrorMessage } from '@atlaskit/form';
import styled from 'styled-components';

const SpinnerWrapper = styled.div`
    margin-top: 20%;
    display: flex;
    justify-content: center;
`;

export default function Error({error}) {
  return (
    <SpinnerWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SpinnerWrapper>
  );
}