import React, { useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import IntegrationEventTracker from './IntegrationEventTracker';
import IntegrateWithSnyk from './IntegrateWithSnyk';
import LogIn from './LogIn';
import SelectIntegration from './SelectIntegration';
import { dispatchIntegration } from '../store/dispatchers';

import LogInSpinner from './LogInSpinner';

const EventTrackerWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;

export default function SnykIntegration() {
  const [stage, setStage] = useState(0);
  const [organization, setOrganization] = useState();
  const [processingOauth, setProcessingOauth] = useState(false);

  const { jwtToken, username, currentUserId, workspaceSlug, repoSlug } = useSelector((state) => state.configuration);
  const { token, org } = useSelector((state) => state.integration);
  const dispatch = useDispatch();

  const callback = (data) => {
    dispatchIntegration(dispatch, data, jwtToken);
  };

  useLayoutEffect(() => {
    if (!token) {
      setStage(0);
    }
    if (token) {
      setStage(1);
    }
    if (!org) {
      setOrganization(undefined);
    }
    if (org) {
      setStage(2);
      setOrganization({ label: 'set', value: 'set' });
    }
  }, [token, org]);

  const view = () => (
    <Page>
      <Grid layout='fluid'>
        <GridColumn medium={12}>
          <EventTrackerWrapper>
            <IntegrationEventTracker stage={stage} />
          </EventTrackerWrapper>
        </GridColumn>
        {stage === 0 && !processingOauth && !token && (
          <LogIn setProcessingOauth={setProcessingOauth} jwtToken={jwtToken} currentUserId={currentUserId} />
        )}
        {stage === 0 && processingOauth && !token && (
          <LogInSpinner
            jwtToken={jwtToken}
            setStage={setStage}
            setProcessingOauth={setProcessingOauth}
          />
        )}
        {stage === 1 && !organization && (
          <SelectIntegration
            setOrganization={setOrganization}
            jwtToken={jwtToken}
            callback={callback}
          />
        )}
        {stage === 2 && organization && (
          <IntegrateWithSnyk
            jwtToken={jwtToken}
            callback={callback}
            username={username}
            workspaceSlug={workspaceSlug}
            repoSlug={repoSlug}
            currentUserId={currentUserId}
          />
        )}
      </Grid>
    </Page>
  );

  return view();
}