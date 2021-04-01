import React, { useEffect, useState } from "react";
import Page, { Grid, GridColumn } from "@atlaskit/page";
import VulnerabilityBanner from "./VulnerabilityBanner";
import ProjectTable from "./projectTable/ProjectTable";
import { getProjects } from "../services/SnykService";

export default function ProjectList({ apiKey }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects(apiKey).then((result) => {
      setProjects(
        result.projects.map((project) => {
          return {
            id: project.id,
            name: project.name,
            type: project.type,
            issueCounts: project.issueCountsBySeverity,
            testedAt: project.lastTestedDate,
          };
        })
      );
    });
  }, [apiKey]);

  const totalIssueCounts = () => {
    let high = 0;
    let medium = 0;
    let low = 0;
    projects.forEach((project) => {
      high += project.issueCounts.high;
      medium += project.issueCounts.medium;
      low += project.issueCounts.low;
    });
    return { high: high, medium: medium, low: low };
  };

  return (
    <Page>
      <Grid layout="fluid">
        <GridColumn medium={12}>
          <h1>Snyk</h1>
          <h3>Security insights</h3>
        </GridColumn>
        <GridColumn medium={12}>
          <VulnerabilityBanner issueCounts={totalIssueCounts()} />
        </GridColumn>
        <GridColumn medium={12}>
          <ProjectTable projects={projects} />
        </GridColumn>
      </Grid>
    </Page>
  );
}
