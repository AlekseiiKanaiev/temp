import React from 'react';
import {
  Router,
  RouteComponent,
  createBrowserHistory,
} from 'react-resource-router';

function App({ routes }) {
  return (
    <Router routes={routes} history={createBrowserHistory()}>
      <RouteComponent />
    </Router>
  );
}

export default App;
