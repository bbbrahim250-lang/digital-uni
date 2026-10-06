# Claude Code Task — Integrate OSIRIS Adapters into ABRAHAM FAA Research Project

## Mission

Implement the OSIRIS interoperability plan for the ABRAHAM FAA 10D / 4D Trajectory research project using the two pinned upstream revisions recorded in `OPEN_SOURCE_DEPENDENCY_REGISTER.md`.

This is an integration task, not a redesign of ABRAHAM.

## Non-negotiable constraints

1. Preserve the existing ABRAHAM 10-dimensional model and 4D-trajectory logic.
2. K9 remains **Interoperability & Decision Assurance**.
3. Human controller authority remains final: ACCEPT / MODIFY / REJECT / TAKE OVER.
4. OSIRIS components are non-authoritative external services.
5. Do not copy AGPL Osiris source into the ABRAHAM proprietary core.
6. Keep AGPL Osiris in a separate process/container and interface via MCP/HTTPS.
7. MIT OSIRIS may be adapted only with license/copyright notice preserved.
8. Pin upstream SHAs; do not depend on floating branches.
9. No production deployment and no merge to `main` without owner approval.
10. Capture screenshots/logs of all new tests for inclusion in the FAA evidence appendix.

## Work sequence

### A. Audit before coding
- Locate the active ABRAHAM FAA simulator/runtime, current tests and 4D trajectory modules.
- Report exact file paths and current test count.
- Confirm whether the current runtime is in this repository or a separate worktree/branch.
- Do not guess missing paths.

### B. Add the external-data gateway
- Create a narrow OSIRIS Global adapter.
- Normalize only required aviation/context fields.
- Add source ID, observed time, received time, schema version and observation age.
- Feed relevant derived state to K4/K5/K6/K9/K10 only through existing ABRAHAM interfaces.
- Do not bypass existing safety/confidence gates.

### C. Add provenance service adapter
- Implement a separate MCP/HTTPS client for Osiris memory.
- Store advisory inputs, K1-K10 state, reason, confidence, model/build version, human action and outcome.
- Implement strict timeout/circuit-breaker behavior.
- ABRAHAM output must be identical when the provenance service is unavailable, except for a clear audit-service status flag.

### D. Add tests
At minimum implement the ten K9/safety tests listed in `FAA_INTEGRATION_PLAN.md`.

Run the full existing ABRAHAM suite plus new tests. Do not claim a new test total until the actual run is complete.

### E. Demonstrator
If the existing FAA simulator UI has a global map, integrate OSIRIS-derived public context as an optional overlay. Otherwise first present a minimal adapter status/provenance panel. Do not replace the current simulator layout without approval.

### F. Evidence
Produce:
- exact test command and output;
- screenshots of passing tests;
- screenshots of adapter status;
- one sample end-to-end provenance trace;
- dependency/license report;
- changed-file list;
- rollback instructions.

## Stop condition

Stop before merge/deploy and present:
- architecture delta;
- changed files;
- test evidence;
- screenshots;
- unresolved risks;
- recommendation whether to proceed.
