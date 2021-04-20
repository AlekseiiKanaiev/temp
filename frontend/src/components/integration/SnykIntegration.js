import React, { useState, useLayoutEffect } from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import IntegrationEventTracker from './IntegrationEventTracker';
import IntegrateWithSnyk from './IntegrateWithSnyk';
import LogIn from './LogIn';
import ProvidePermissions from './ProvidePermissions';
import ConfigrmAccess from './ConfirmAccess';
import SelectIntegration from './SelectIntegration';

import LogInSpinner from './LogInSpinner';

const EventTrackerWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;

export default function SnykIntegration({
  jwtToken, callback, workspace, integrationParams,
}) {
  const [stage, setStage] = useState(0);
  const [organization, setOrganization] = useState();
  const [processingOauth, setProcessingOauth] = useState(false);

  useLayoutEffect(() => {
    if (integrationParams.token) {
      setStage(2);
    }
    if (integrationParams.org) {
      setOrganization({ label: 'set', value: 'set' });
    }
  }, [integrationParams]);

  const view = () => (
    <Page>
      <Grid layout="fluid">
        <GridColumn medium={12}>
          <EventTrackerWrapper>
            <IntegrationEventTracker stage={stage} />
          </EventTrackerWrapper>
        </GridColumn>
        {stage === 0 && !processingOauth && !integrationParams.token && (
          <LogIn setProcessingOauth={setProcessingOauth} jwtToken={jwtToken} />
        )}
        {stage === 0 && processingOauth && !integrationParams.token && (
          <LogInSpinner jwtToken={jwtToken} setStage={setStage} setProcessingOauth={setProcessingOauth} />
        )}
        {stage === 1 && <ProvidePermissions setStage={setStage} />}
        {stage === 2 && !organization && (
          <SelectIntegration
            setStage={setStage}
            setOrganization={setOrganization}
            jwtToken={jwtToken}
          />
        )}
        {stage === 2 && organization && (
          <IntegrateWithSnyk jwtToken={jwtToken} callback={callback} workspace={workspace} integrated={integrationParams.integrated} />
        )}
      </Grid>
    </Page>
  );

  return view();
}
