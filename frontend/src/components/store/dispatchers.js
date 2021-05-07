import {
  getIntegrationTokenOrg,
  getProjects,
  getSavedOrg,
  sendToAnalytics,
} from '../../services/SnykService';
import {
  setError, setIntegration, setProjects, setOrgName,
} from './actions';

export const dispatchIntegration = (
  dispatch,
  skipImportProjectPage,
  jwtToken,
) => {
  getIntegrationTokenOrg(jwtToken)
    .then((result) => {
      if (result.error) {
        dispatch(setError({
          error: result.error_short_message,
          message: result.message,
          info: result.error_info,
        }));
      } else {
        dispatch(
          setIntegration({
            integrated: result.integrated,
            token: result.token,
            org: result.org,
            skipImportPage: skipImportProjectPage,
          }),
        );
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export const dispatchProjects = (dispatch, configuration, imported) => {
  const projectTypes = ['rubygems',
    'npm',
    'yarn',
    'yarn-workspace',
    'maven',
    'pip',
    'sbt',
    'gradle',
    'golangdep',
    'govendor',
    'gomodules',
    'nuget',
    'paket',
    'composer',
    'golang',
    'cocoapods',
    'rpm',
    'dockerfile'];

  const {
    jwtToken, repoOwner, repoSlug, currentUserId,
  } = configuration;
  getSavedOrg(jwtToken)
    .then((result) => {
      dispatch(setOrgName(result.orgslug));
      getProjects(jwtToken, `${repoOwner}/${repoSlug}:`)
        .then((result) => {
          const projects = result.projects
            .filter((project) => project.name.startsWith(`${repoOwner}/${repoSlug}`) && projectTypes.includes(project.type))
            .map((project) => ({
              id: project.id,
              name: project.name,
              type: project.type,
              issueCounts: project.issueCountsBySeverity,
              testedAt: project.lastTestedDate,
            }));
          dispatch(
            setProjects({
              projects,
              imported,
            }),
          );
          sendToAnalytics(jwtToken, {
            type: 'track',
            eventMessage: {
              event: 'connect_app_page_view',
              properties: {
                bb_user_id: currentUserId,
                viewed_page: 'list_of_projects',
                repo_slug: `${repoOwner}/${repoSlug}`,
                number_of_projects: projects.length,
              },
            },
          });
          if (imported) {
            sendToAnalytics(jwtToken, {
              type: 'track',
              eventMessage: {
                event: 'connect_app_repo_imported',
                properties: {
                  bb_user_id: currentUserId,
                  repo_slug: `${repoOwner}/${repoSlug}`,
                  import_result: 'success',
                  number_of_projects: projects.length,
                },
              },
            });
          }
        });
    })
    .catch((err) => {
      throw new Error(err);
    });
};
