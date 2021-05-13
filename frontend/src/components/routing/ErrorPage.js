import React, { useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import { setError } from '../store/actions';
import { sendToAnalytics } from '../../services/SnykService';

const ImageWrapper = styled.div`
  margin-top: 50px;
  height: 400px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  min-width: 650px;
  max-width: 650px;
  margin-top: 5%;
  margin-bottom: 5%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  text-align: center;
`;

const TextWrapper = styled.p`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

const InfoWrapper = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 10px;
  line-height: 20px;
  border: 1px solid #ccc;
  padding: 5px;
  white-space: pre-line;
`;

const InfoBlockWrapper = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
  margin-left: 5px;
  margin-right: 5px;
`;

const LinkWrapper = styled.a`
  color: rgb(0, 82, 204) !important;
`;

const H1TextWrapper = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
`;

export default function ErrorPage() {
  const exception = useSelector((state) => state.error);
  const { jwtToken, currentUserId } = useSelector((state) => state.configuration);
  const [error] = useState(exception.error);
  const [message] = useState(exception.message);
  const [info] = useState(exception.info);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(setError({}));
    sendToAnalytics(jwtToken, {
      type: 'track',
      eventMessage: {
        event: 'connect_app_page_view',
        properties: {
          bb_user_id: currentUserId,
          viewed_page: 'error',
          error,
          error_message: message,
          error_info: info,
        },
      },
    });
  }, []);

  return (
    <Page>
      <Grid layout="fluid">
        <GridColumn medium={12}>
          <ContentWrapper>
            <ImageWrapper>
              <img src="/ico/error.svg" alt="error importing" />
            </ImageWrapper>
            <H1TextWrapper>{error}</H1TextWrapper>
            <TextWrapper>{message}</TextWrapper>
            {info && (
            <InfoBlockWrapper>
              Additional info for support enquires:
              <InfoWrapper>
                <p>{info}</p>
              </InfoWrapper>
            </InfoBlockWrapper>
            )}
            <TextWrapper>
              Please try again later or
              {' '}
              <LinkWrapper href="https://snyk.io/contact-us/">
                contact our support
              </LinkWrapper>
              contact our support
            </TextWrapper>
          </ContentWrapper>
        </GridColumn>
      </Grid>
    </Page>
  );
}
