import React from 'react';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';

const SpinnerWrapper = styled.div`
    margin-top: 20%;
    display: flex;
    justify-content: center;
`;

export default function CustomSpinner() {
  return (
    <SpinnerWrapper>
      <Spinner size="xlarge" />
    </SpinnerWrapper>
  );
}
