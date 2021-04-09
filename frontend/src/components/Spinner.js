import React from 'react';
import { GridColumn } from '@atlaskit/page';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';

export default function CustomSpinner() {
  const SpinnerWrapper = styled.div`
    margin-top: 20%;
    display: flex;
    justify-content: center;
  `;

  return (
    <GridColumn medium={12}>
      <SpinnerWrapper>
        <Spinner size="xlarge" />
      </SpinnerWrapper>
    </GridColumn>
  );
}
