import React, { useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid, { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import { setError } from '../store/actions';

const ImageWrapper = styled.div`
  margin-top: 50px;
  height: 400px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  text-align: center;
`;

const TextWrapper = styled.p`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

const InfoWrapper = styled.div`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 10px;
  line-height: 20px;
  border: 1px solid #ccc;
  padding: 5px;
  white-space: pre-line;
`;

const InfoBlockWrapper = styled.div`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
  margin-left: 5px;
  margin-right: 5px;
`;

const H1TextWrapper = styled.h1`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
`;

export default function ErrorPage() {
  const exception = useSelector((state) => state.error);
  const [error] = useState(exception.error);
  const [message] = useState(exception.message);
  const [info] = useState(exception.info);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(setError({}));
  }, []);

  return (
    <Grid layout='fluid'>
      <GridColumn medium={12}>
        <ContentWrapper>
          <ImageWrapper>
            <img src='/ico/error.svg' alt='error importing' />
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
            Please try again later or{' '}
            <a
              href='https://snyk.io/contact-us/'
              target='_blank'
              rel='noreferrer'
            >
              contact our support
            </a>
          </TextWrapper>
        </ContentWrapper>
      </GridColumn>
    </Grid>
  );
}