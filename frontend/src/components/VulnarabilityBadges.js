import React from "react";
import VulnerabilityBadge from "./VulnerabilityBadge";

export default function VulnarabilityBadges({ issueCounts }) {
  return (
    <>
      <VulnerabilityBadge color={"red"} data={issueCounts.high} />
      <VulnerabilityBadge color={"yellow"} data={issueCounts.medium} />
      <VulnerabilityBadge color={"black"} data={issueCounts.low} />
    </>
  );
}
