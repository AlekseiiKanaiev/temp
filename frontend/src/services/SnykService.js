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

const defaultImportProjectBody = {
  target: {
    owner: 'snyk',
    name: 'goof',
    branch: 'master',
  },
};

const defaultIntegrationBody = {
  type: 'bitbucket-cloud',
  credentials: { token: '' },
};

export async function getProjects(jwtToken) {
  const url = '/snyk/org/orgid/projects';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function getIssues(jwtToken, id) {
  const url = `/snyk/org/orgid/project/${id}/aggregated-issues`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(defaultIssuesBody),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function importProject(jwtToken) {
  const integrationId = await getIntegrationId(jwtToken);
  if (integrationId === '') {
    throw new Error('integration is not set');
  }
  const url = `/snyk/org/orgid/integrations/${integrationId}/import`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(defaultImportProjectBody),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function getIntegrationId(jwtToken) {
  const resJson = await getIntegration(jwtToken);
  return !('bitbucket-cloud' in resJson) ? '' : resJson['bitbucket-cloud'];
}

export async function addIntegration(jwtToken, integrationToken) {
  const url = '/snyk/org/orgid/integrations';
  const body = defaultIntegrationBody;
  body.credentials = { token: integrationToken };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await res.json();
}

export async function getIntegration(jwtToken) {
  const url = '/snyk/org/orgid/integrations';
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch GET ${url}, received ${res}`);
  }
  return await res.json();
}
