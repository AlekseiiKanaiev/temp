import React, { useState } from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import IntegrationEventTracker from './IntegrationEventTracker';
import IntegrateWithSnyk from './IntegrateWithSnyk';
import LogIn from './LogIn';
import ProvidePermissions from './ProvidePermissions';
import ConfigrmAccess from './ConfirmAccess';
import SelectIntegration from './SelectIntegration';

const EventTrackerWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;

export default function SnykIntegration({ jwtToken, callback }) {
  const [stage, setStage] = useState(0);
  const [granted, setGranted] = useState(undefined);
  const [organization, setOrganization] = useState();

  return (
    <Page>
      <Grid layout="fluid">
        <GridColumn medium={12}>
          <EventTrackerWrapper>
            <IntegrationEventTracker stage={stage} />
          </EventTrackerWrapper>
        </GridColumn>
        {stage === 0 && granted === undefined && (
          <LogIn setGranted={setGranted} />
        )}
        {stage === 0 && granted === false && (
          <ConfigrmAccess setStage={setStage} setGranted={setGranted} />
        )}
        {stage === 1 && <ProvidePermissions setStage={setStage} />}
        {stage === 2 && !organization && (
          <SelectIntegration
            setStage={setStage}
            setOrganization={setOrganization}
          />
        )}
        {stage === 2 && organization && (
          <IntegrateWithSnyk jwtToken={jwtToken} callback={callback} />
        )}
      </Grid>
    </Page>
  );
}
