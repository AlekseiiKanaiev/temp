import React, { useState, useLayoutEffect } from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Textfield from '@atlaskit/textfield';
import {
  getSnykUser, getSavedOrg, restartIntegration,
  sendToAnalytics,
} from '../../services/SnykService';
import Spinner from '../Spinner';

import { dispatchIntegration } from '../store/dispatchers';

const ContainerWrapper = styled.div`
  margin-left: 30px;
  margin-top: 10px;
`;

const ContentWrapper = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  display: inline-block;
`;
const TextFieldWrapper = styled.div`
  margin-bottom 20px;
`;

const LinkWrapper = styled.span`
  cursor: pointer;
  color: blue;
  text-decoration: underline;
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

const BoldTextWrapper = styled.label`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
`;

const H1TextWrapper = styled.label`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 24px;
  line-height: 28px;
`;

const ModalH1TextWrapper = styled.label`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
`;

const ModalGeneralTextWrapper = styled.label`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

const ButtonTextWrapper = styled.label`
  font-family: sans-serif;
  font-size: 14px;
`;

export default function SnykIntegrationsSettings() {
  const [user, setUser] = useState('');
  const [organization, setOrganization] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { jwtToken, currentUserId } = useSelector((state) => state.configuration);
  const dispatch = useDispatch();

  const snykSettings = () => {
    restartIntegration(jwtToken, currentUserId)
      .then(() => dispatchIntegration(dispatch, false, jwtToken))
      .catch((err) => {
        throw new Error(err);
      });
  };

  useLayoutEffect(() => {
    if (jwtToken) {
      sendToAnalytics(jwtToken, {
        type: 'track',
        eventMessage: {
          event: 'connect_app_page_view',
          properties: {
            bb_user_id: currentUserId,
            viewed_page: 'settings',
          },
        },
      });
      getSnykUser(jwtToken)
        .then((result) => {
          setUser(result.username);
          getSavedOrg(jwtToken)
            .then((result) => {
              setOrganization(result.orgname);
              setLoading(false);
            })
            .catch((err) => {
              throw new Error(err);
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [jwtToken]);

  const view = () => {
    if (loading) {
      return <Spinner />;
    }
    return (
      <Page>
        <Grid layout="fluid">
          <GridColumn medium={6}>
            <ContainerWrapper>
              <ContentWrapper>
                <H1TextWrapper>Snyk Integrations Settings</H1TextWrapper>
              </ContentWrapper>
              <TextFieldWrapper>
                <BoldTextWrapper>
                  Connected Snyk user
                  <Textfield value={user} />
                </BoldTextWrapper>
              </TextFieldWrapper>
              <TextFieldWrapper>
                <BoldTextWrapper>
                  Connected Snyk organization
                  <Textfield value={organization} />
                </BoldTextWrapper>
              </TextFieldWrapper>
              <LinkWrapper onClick={() => setIsOpen(true)}>
                Connect via a different Snyk user/organization
              </LinkWrapper>
            </ContainerWrapper>
            <ModalTransition>
              {isOpen && (
                <Modal
                  actions={[
                    {
                      text: <ButtonTextWrapper>Confirm</ButtonTextWrapper>,
                      onClick: () => {
                        setIsOpen(false);
                        snykSettings();
                      },
                    },
                    {
                      text: <ButtonTextWrapper>Cancel</ButtonTextWrapper>,
                      onClick: () => {
                        setIsOpen(false);
                      },
                    },
                  ]}
                  onClose={() => setIsOpen(false)}
                  heading={(
                    <ModalH1TextWrapper>
                      This restarts the whole integration settings process
                    </ModalH1TextWrapper>
                  )}
                >
                  <ModalGeneralTextWrapper>
                    Are you sure you want to continue?
                  </ModalGeneralTextWrapper>
                </Modal>
              )}
            </ModalTransition>
          </GridColumn>
        </Grid>
      </Page>
    );
  };
  return view();
}
