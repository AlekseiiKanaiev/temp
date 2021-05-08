import React, { useState, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import { ErrorMessage } from '@atlaskit/form';
import {
  saveOrganization,
  getOrganizations,
  deleteToken,
} from '../../services/SnykService';
import {
  setError
} from '../store/actions';

import Spinner from '../Spinner';

const ContainerWrapper = styled.div`
  min-width: 650px;
  max-width: 650px;
  height: 300px;
  margin-top: 5%;
  margin-bottom: 5%;
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
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 18px;
  line-height: 24px;
`;

const ButtonWrapper = styled.span`
  float: right;
  margin-top: 40px;
  margin-right: 20px;
`;

const H1TextWrapper = styled.h1`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
`;

const ButtonTextWrapper = styled.label`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

export default function SelectIntegration({
  setOrganization,
  jwtToken,
  callback,
  currentUserId,
}) {
  const [organizations, setOrganizations] = useState([]);
  const [selected, setSelected] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    fetchOrganizations();
  }, [jwtToken]);

  const fetchOrganizations = () => {
    getOrganizations(jwtToken).then((result) => {
      getOrganizations;
      const orgs = [];
      if (result.error) {
        dispatch(setError({
          error: result.error_short_message,
          message: result.message,
          info: result.error_info,
        }));
      } else {
        if (result.orgs) {
          result.orgs.forEach((org) => {
            orgs.push({ label: org.name, value: org.id, orgslug: org.slug });
          });
        }
        if (orgs.length === 1) {
          saveOrg(orgs[0]);
        }
      }
      setOrganizations(orgs);
      setLoading(false);
    });
  };

  const backButton = () => {
    deleteToken(jwtToken)
      .then(() => callback(true))
      .catch((err) => {
        throw new Error(err);
      });
  };

  const saveOrg = (orgJson) => {
    if (!orgJson.label) {
      const org = getOrgByValue(orgJson.id);
      if (org.length === 0) {
        throw new Error(`Could not find org for ${orgJson.id}`);
      }
      orgJson = org[0];
    }
    saveOrganization(jwtToken, {
      id: orgJson.value,
      name: orgJson.label,
      slug: orgJson.orgslug,
      currentuserid: currentUserId,
    });
    setOrganization(orgJson.value);
    callback(true);
  };

  const getOrgByValue = (value) => organizations.filter((org) => org.value === value);

  const view = () => {
    if (loading) {
      return <Spinner />;
    }
    return (
      <>
        <ContainerWrapper>
          <TitleWrapper>
            <H1TextWrapper>Create an integration</H1TextWrapper>
          </TitleWrapper>
          <ContentWrapper>
            Select the organization in Snyk, you would like to associate your
            workspace with:
          </ContentWrapper>
          <ContentWrapper>
            <Select
              placeholder="Select the organization in Snyk"
              options={organizations}
              onChange={(item) => setSelected(item.value)}
            />
          </ContentWrapper>
          <ButtonWrapper>
            <Button
              onClick={() => saveOrg({ id: selected })}
              isDisabled={!selected}
              appearance="primary"
            >
              <ButtonTextWrapper>Done</ButtonTextWrapper>
            </Button>
          </ButtonWrapper>
          <ButtonWrapper>
            <Button
              onClick={() => {
                backButton();
              }}
            >
              <ButtonTextWrapper>Back</ButtonTextWrapper>
            </Button>
          </ButtonWrapper>
        </ContainerWrapper>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </>
    );
  };

  return <GridColumn medium={12}>{view()}</GridColumn>;
}
