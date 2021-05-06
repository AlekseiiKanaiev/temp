export default (state, action) => {
    switch (action.type) {
      case 'SET_ERROR':
        return { ...state, error: action.payload };
      case 'SET_INTEGRATION':
        return { ...state, integration: action.payload };
      case 'SET_PROJECTS':
        return { ...state, projectsInfo: action.payload };
      case 'SET_ORG_NAME':
        return { ...state, orgName: action.payload };
      default:
        return state;
    }
  };