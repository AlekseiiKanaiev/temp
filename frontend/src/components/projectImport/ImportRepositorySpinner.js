import React from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import Spinner from '../Spinner';

const ContainerWrapper = styled.div`
  min-width: 650px;
  max-width: 650px;
  height: 280px;
  margin-top: 30px;
  margin-bottom: 5%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
    rgba(9, 30, 66, 0.31) 0px 0px 1px;
  display: block;
  text-align: center;
`;

const ContentWrapper = styled.div`
  margin-top: 30px;
  display: inline-block;
`;

const TextWrapper = styled.p`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 24px;
`;

export default function ImportRepositorySpinner() {
  return (
    <GridColumn medium={12}>
      <ContainerWrapper>
        <ContentWrapper>
          <Spinner size="large" />
          <TextWrapper>
            Importing your repository to Snyk and scanning it for
            vulnerabilities...
          </TextWrapper>
        </ContentWrapper>
      </ContainerWrapper>
    </GridColumn>
  );
}
