import ErrorPage from './ErrorPage';
import NoFilesDetected from './NoFilesDetected';
import AccountPage from './AccountPage';
import RepoPage from './RepoPage';

export const appRoutes = [
  {
    name: 'main',
    path: '/pages/repo',
    exact: true,
    component: RepoPage,
  },
  {
    name: 'error',
    path: '/error',
    exact: true,
    component: ErrorPage,
  },
  {
    name: 'noFilesDetected',
    path: '/noFilesDetected',
    exact: true,
    component: NoFilesDetected,
  },
];

export const accountRoutes = [
  {
    name: 'main',
    path: '/pages/account',
    exact: true,
    component: AccountPage,
  },
  {
    name: 'error',
    path: '/error',
    exact: true,
    component: ErrorPage,
  },
];
