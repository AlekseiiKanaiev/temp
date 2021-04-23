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
    },
  };
  const res = await executePost(jwtToken, url, projectBody);

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function getIssues(jwtToken, id) {
  const url = `/snyk/org/orgid/project/${id}/aggregated-issues`;
  const res = await executePost(jwtToken, url, defaultIssuesBody);

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function importProject(jwtToken, repoOwner, repoSlug, repoMainBranch) {
  const integrationId = await getIntegrationId(jwtToken);
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

  if (!res.ok) {
    console.error(`Could not fetch GET ${url}, received ${res}`);
    return {};
  }
  const result = { location: res.headers.get('location'), json: res.json() };
  return result;
}

export async function getIntegrationId(jwtToken) {
  const resJson = await getIntegration(jwtToken);
  return !('bitbucket-cloud' in resJson) ? '' : resJson['bitbucket-cloud'];
}

export async function addIntegration(jwtToken, integrationToken, workspace) {
  const url = '/snyk/org/orgid/integrations';
  const body = defaultIntegrationBody;
  body.credentials = { username: workspace, password: integrationToken };
  const res = await executePost(jwtToken, url, body);
  return res.json();
}

export async function getIntegration(jwtToken) {
  const url = '/snyk/org/orgid/integrations';
  const res = await executeGet(jwtToken, url);

  if (!res.ok) {
    // throw new Error(`Could not fetch GET ${url}, received ${res}`);
    return [];
  }
  return res.json();
}

export async function getOrganizations(jwtToken) {
  // const user = await getSnykUser(jwtToken);
  const url = '/snyk/orgs';
  const res = await executeGet(jwtToken, url);

  if (!res.ok) {
    throw new Error(`Could not fetch GET ${url}, received ${res}`);
  }
  return res.json();
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

  if (!res.ok) {
    throw new Error(`Could not fetch GET ${url}, received ${res}`);
  }
  return res.json();
}

export async function getNewState(jwtToken) {
  const url = '/app/state';
  const res = await executePost(jwtToken, url, {});

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function restartIntegration(jwtToken) {
  const url = '/app/integration';
  const res = await executePost(jwtToken, url, {});

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
  const integration = token.token && org.org ? await getIntegrationId(jwtToken) : '';
  const integrationStatus = integration !== '';
  return { integrated: integrationStatus, token: token.token, org: org.org };
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
