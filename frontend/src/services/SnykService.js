const defaultProjectsBody = {
  filters: {
    tags: {
      includes: [
        {
          key: 'example-tag-key',
          value: 'example-tag-value',
        },
      ],
    },
    attributes: {
      criticality: ['high'],
      environment: ['backend'],
      lifecycle: ['development'],
    },
  },
};

const defaultIssuesBody = {
  includeDescription: true,
  includeIntroducedThrough: true,
  filters: {
    severities: ['high', 'medium', 'low'],
    exploitMaturity: [
      'mature',
      'proof-of-concept',
      'no-known-exploit',
      'no-data',
    ],
    types: ['vuln', 'license'],
    ignored: false,
    patched: false,
    priority: {
      score: {
        min: 0,
        max: 1000,
      },
    },
  },
};

const defaultIntegrationBody = {
  type: 'bitbucket-cloud',
  credentials: { token: '' },
};

export async function getProjects(jwtToken, projectName) {
  const url = '/snyk/org/orgid/projects';
  const projectBody = {
    filters: {
      name: projectName,
      origin: 'bitbucket-cloud',
    },
  };
  const res = await executePost(jwtToken, url, projectBody);

  return getJsonFromRequestResult(res);
}

export async function getIssues(jwtToken, id) {
  const url = `/snyk/org/orgid/project/${id}/aggregated-issues`;
  const res = await executePost(jwtToken, url, defaultIssuesBody);

  return getJsonFromRequestResult(res);
}

export async function importProject(jwtToken, repoOwner, repoSlug, repoMainBranch) {
  const integrationJson = await getIntegrationId(jwtToken);
  const integrationId = integrationJson.id;
  if (integrationId === '') {
    throw new Error('integration is not set');
  }
  const importProjectBody = {
    target: {
      owner: repoOwner,
      name: repoSlug,
      branch: repoMainBranch,
    },
  };
  const url = `/snyk/org/orgid/integrations/${integrationId}/import`;
  const res = await executePost(jwtToken, url, importProjectBody);

  const result = await getJsonFromRequestResult(res);
  result.location = res.headers.get('location');
  return result;
}

export async function getIntegrationId(jwtToken) {
  const resJson = await getIntegration(jwtToken);
  return {
    id: !('bitbucket-cloud' in resJson) ? '' : resJson['bitbucket-cloud'],
    error: resJson.error ? resJson.error : false,
    message: resJson.message ? resJson.message : '',
    error_short_message: resJson.error_short_message ? resJson.error_short_message : '',
    error_info: resJson.error_info ? resJson.error_info : '',

  };
}

export async function addIntegration(jwtToken, integrationToken, username) {
  const url = '/snyk/org/orgid/integrations';
  const body = defaultIntegrationBody;
  body.credentials = { username, password: integrationToken };
  const res = await executePost(jwtToken, url, body);
  return getJsonFromRequestResult(res);
}

export async function getIntegration(jwtToken) {
  const url = '/snyk/org/orgid/integrations';
  const res = await executeGet(jwtToken, url);

  return getJsonFromRequestResult(res, false);
}

export async function getOrganizations(jwtToken) {
  const url = '/snyk/orgs';
  const res = await executeGet(jwtToken, url);
  return getJsonFromRequestResult(res);
}

export async function saveOrganization(jwtToken, org) {
  const url = '/app/org';
  const res = await executePost(jwtToken, url, org);

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function getImportJobDetails(jwtToken, jobUrl) {
  const url = `/snyk/${jobUrl}`;
  const res = await executeGet(jwtToken, url);

  return getJsonFromRequestResult(res);
}

export async function getNewState(jwtToken, currentuserid) {
  const url = '/app/state';
  const res = await executePost(jwtToken, url, { currentuserid });

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function restartIntegration(jwtToken, currentuserid) {
  const url = '/app/integration';
  const res = await executePost(jwtToken, url, { currentuserid });

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function checkAppPassword(jwtToken, username, appPassword, workspaceSlug, repoSlug) {
  const url = '/app/checkapppassword';
  const res = await executePost(jwtToken, url, {
    username, password: appPassword, workspaceSlug, repoSlug,
  });

  return getJsonFromRequestResult(res);
}

export async function sendToAnalytics(jwtToken, eventMessage) {
  const url = '/app/analytics';
  const res = await executePost(jwtToken, url, eventMessage);

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function getApiToken(jwtToken) {
  const url = '/app/token';
  const res = await executeGet(jwtToken, url);

  if (!res.ok) {
    throw new Error(`Could not fetch GET ${url}, received ${res}`);
  }
  return res.json();
}

export async function getSavedOrg(jwtToken) {
  const url = '/app/org';
  const res = await executeGet(jwtToken, url);

  if (!res.ok) {
    throw new Error(`Could not fetch GET ${url}, received ${res}`);
  }
  return res.json();
}

export async function getIntegrationTokenOrg(jwtToken) {
  const token = await getApiToken(jwtToken);
  const org = await getSavedOrg(jwtToken);
  const integration = token.token && org.org ? await getIntegrationId(jwtToken) : { id: '' };
  const integrationStatus = integration.id !== '';
  return {
    integrated: integrationStatus,
    token: token.token,
    org: org.org,
    error: integration.error,
    message: integration.message,
    error_short_message: integration.error_short_message ? integration.error_short_message : '',
    error_info: integration.error_info ? integration.error_info : '',
  };
}

export async function getSnykUser(jwtToken) {
  const url = '/snyk/user/me';
  const res = await executeGet(jwtToken, url);

  if (!res.ok) {
    throw new Error(`Could not fetch GET ${url}, received ${res}`);
  }
  return res.json();
}

export async function deleteToken(jwtToken) {
  const url = '/app/token';
  const res = await executeDelete(jwtToken, url);

  if (!res.ok) {
    throw new Error(`Could not fetch GET ${url}, received ${res}`);
  }
  return res.json();
}

export async function deleteOrg(jwtToken) {
  const url = '/app/org';
  const res = await executeDelete(jwtToken, url);

  if (!res.ok) {
    throw new Error(`Could not fetch GET ${url}, received ${res}`);
  }
  return res.json();
}

async function executeGet(jwtToken, uri) {
  const url = uri;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
}

async function executePost(jwtToken, uri, body) {
  const url = uri;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res;
}

async function executeDelete(jwtToken, uri) {
  const url = uri;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  });

  return res;
}

async function getJsonFromRequestResult(res) {
  let ret = {};
  if (!res.ok) {
    console.error(`Could not fetch  ${res.url}, received ${res}`);
    ret.error = true;
    ret.error_short_message = 'Internal Server Error';
    ret.message = '';
    ret.error_info = res.headers.get('snyk-request-id') ? `snyk-request-id: ${res.headers.get('snyk-request-id')}` : '';
    const resBody = await res.text();
    try {
      const resJson = JSON.parse(resBody);
      ret.message = resJson.message ? resJson.message : '';
    } catch (err) {
      ret.message = `status: ${res.status} for ${res.url}`;
    }
    if (res.status >= 500) {
      ret.message = 'Sorry, there were some technical issues while processing your request';
    }
  } else {
    ret = await res.json();
    ret.error_info = ret.error ? res.headers.get('snyk-request-id') : '';
    ret.error_short_message = ret.message ? ret.message : '';
    ret.error = ret.error ? ret.error : false;
    ret.message = ret.message ? ret.message : '';
  }
  return ret;
}
