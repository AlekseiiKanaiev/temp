import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dispatchIntegration } from '../store/dispatchers';
import { Redirect } from 'react-resource-router';
import SnykIntegration from '../../components/integration/SnykIntegration';
import Spinner from '../../components/Spinner';

function MainPage({ context }) {
  const [loading, setLoading] = useState(true);
  const { jwtToken } = useSelector((state) => state.configuration);
  const { error } = useSelector((state) => state.error);
  const { integrated, token, org } = useSelector((state) => state.integration);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (jwtToken) {
      dispatchIntegration(dispatch, false, jwtToken);
    }
  }, [jwtToken]);

  useEffect(() => {
    if (integrated !== undefined || token !== undefined || org !== undefined) {
      setLoading(false);
    }
  }, [integrated, token, org]);

  const view = () => {
    if (error) {
      return <Redirect to='/error' push={true} />;
    }
    if (loading) {
      return <Spinner />;
    }
    if (integrated && token && org) {
      return context;
    }
    return <SnykIntegration />;
  };

  return view();
}

export default MainPage;