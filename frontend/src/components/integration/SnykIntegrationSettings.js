import React, { useState, useLayoutEffect } from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Textfield from '@atlaskit/textfield';
import { getSnykUser, getSavedOrg } from '../../services/SnykService';
import Spinner from '../Spinner';

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
  cursor: pointer;
`;

const BoldTextWrapper = styled.label`
  font-weight: bold;
`;

export default function SnykIntegrationsSettings({ jwtToken, callback }) {
  const [user, setUser] = useState('');
  const [organization, setOrganization] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    getUserAndOrg();
  }, [jwtToken]);
  const getUserAndOrg = () => {
    getSnykUser(jwtToken).then((result) => {
      setUser(result.username);
      getSavedOrg(jwtToken).then((result) => {
        setOrganization(result.orgname);
        setLoading(false);
      }).catch((err) => {
        throw new Error(err);
      });
    }).catch((err) => {
      throw new Error(err);
    });
  };

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
                <h1>Snyk Integrations Settings</h1>
              </ContentWrapper>
              <TextFieldWrapper>
                <BoldTextWrapper>
                  Connected Snyk user
                  <Textfield
                    value={user}
                  />
                </BoldTextWrapper>
              </TextFieldWrapper>
              <TextFieldWrapper>
                <BoldTextWrapper>
                  Connected Snyk organization
                  <Textfield
                    value={organization}
                  />
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
                    text: 'Confirm',
                    onClick: () => {
                      setIsOpen(false);
                      callback({ user, organization });
                    },
                  },
                  {
                    text: 'Cancel',
                    onClick: () => {
                      setIsOpen(false);
                    },
                  },
                ]}
                onClose={() => setIsOpen(false)}
                heading="This restarts the whole integration settings process"
              >
                Are you sure you want to continue?
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
