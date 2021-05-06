export const setError = (payload) => {
    return {
      type: 'SET_ERROR',
      payload,
    };
  };
  
  export const setIntegration = (payload) => {
    return {
      type: 'SET_INTEGRATION',
      payload,
    };
  };
  
  export const setProjects = (payload) => {
    return {
      type: 'SET_PROJECTS',
      payload,
    };
  };
  
  export const setOrgName = (payload) => {
    return {
      type: 'SET_ORG_NAME',
      payload,
    };
  };