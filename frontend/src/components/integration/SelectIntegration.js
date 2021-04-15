import React, { useState } from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';

const ContainerWrapper = styled.div`
  min-width: 650px;
  max-width: 650px;
  height: 300px;
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: block;
`;

const TitleWrapper = styled.div`
  margin-top: 10px;
  margin-left: 20px;
  margin-bottom: 50px;
  display: inline-block;
`;

const ContentWrapper = styled.div`
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 40px;
`;

const ButtonWrapper = styled.span`
  float: right;
  margin-top: 50px;
  margin-right: 20px;
`;

export default function SelectIntegration({ setStage, setOrganization }) {
  const options = [
    { label: 'Organization 1', value: 'org1' },
    { label: 'Organization 2', value: 'org2' },
    { label: 'Organization 3', value: 'org3' },
  ];

  const [selected, setSelected] = useState();

  return (
    <GridColumn medium={12}>
      <ContainerWrapper>
        <TitleWrapper>
          <h2>Create an integration</h2>
        </TitleWrapper>
        <ContentWrapper>
          Select the organization in Snyk, you would like to associate your
          workspace with:
        </ContentWrapper>
        <ContentWrapper>
          <Select
            placeholder="Select the organization in Snyk"
            options={options}
            onChange={(item) => setSelected(item.value)}
          />
        </ContentWrapper>
        <ButtonWrapper>
          <Button
            onClick={() => {
              setOrganization(selected);
            }}
            isDisabled={!selected}
            appearance="primary"
          >
            Done
          </Button>
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            onClick={() => {
              setStage(1);
            }}
          >
            Back
          </Button>
        </ButtonWrapper>
      </ContainerWrapper>
    </GridColumn>
  );
}
