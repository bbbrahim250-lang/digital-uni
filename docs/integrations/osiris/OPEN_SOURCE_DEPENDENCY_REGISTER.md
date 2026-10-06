# Digital-UNI / ABRAHAM Open-Source Dependency Register

Status: evaluation only — no OSIRIS source code has been copied into the ABRAHAM safety core.

## 1. OSIRIS Global Intelligence

- Upstream: `jukaben32/Osiris`
- Pinned upstream commit: `5c992c27e9c40645c58f6b845b174f6fed489d9f`
- License: MIT
- Intended ABRAHAM role: external situational-awareness / public-data ingestion and visualization.
- Candidate inputs: OpenSky aviation data, weather and other non-FAA public context feeds.
- Safety classification: NON-AUTHORITATIVE RESEARCH INPUT.
- Integration boundary: REST/event adapter into an ABRAHAM External Data Gateway.
- Required controls:
  - preserve upstream MIT license and copyright notice;
  - pin by commit SHA, never floating `main`;
  - record source, timestamp, schema version, observation age and confidence for every imported event;
  - no direct path from OSIRIS to ATC authority or clearance generation;
  - no reconnaissance/scanner functionality enabled in the FAA research profile unless explicitly approved.

## 2. Osiris Agent Memory / Provenance Graph

- Upstream: `asuramaya/osiris`
- Pinned upstream commit: `4c781169fe7e6dfb3ec4b302e2ba7dfa1cda10d7`
- License: GNU AGPL-3.0
- Intended ABRAHAM role: optional external provenance / memory service for facts, decisions, confidence and event history.
- Safety classification: NON-AUTHORITATIVE RECORDING SERVICE.
- Integration boundary: separate service/container accessed through MCP/HTTPS. Do not copy AGPL implementation into the ABRAHAM proprietary core.
- Required controls:
  - retain AGPL license and notices;
  - keep modified AGPL service source available as required by the license when network users interact with the modified service;
  - ABRAHAM must continue safely if the memory service is unavailable;
  - no decision authority, clearance authority or safety-gate authority may be delegated to Osiris;
  - provenance records must be append-oriented and reconstructable.

## 3. Licensing and provenance policy

Digital-UNI will not disguise, strip attribution from, or misrepresent third-party software. Third-party components are treated as auditable dependencies with pinned revisions and documented boundaries.

MIT and AGPL components may interoperate with ABRAHAM across documented APIs. Interoperability does not mean relicensing AGPL code as MIT. Any deeper combination or distribution model must be reviewed for license compliance before production use.

## 4. FAA research statement

For FAA research materials, describe both OSIRIS components as optional third-party open-source research dependencies. They are not FAA data products, are not FAA-certified, and do not replace ABRAHAM's 10-dimensional safety/confidence gate or human-controller authority.

## 5. Mirror / retention requirements

Before relying on either upstream project:
1. Create a controlled private mirror or source archive at the pinned SHA.
2. Preserve the original LICENSE and provenance metadata.
3. Produce a SHA-256 checksum for the archived source.
4. Maintain an SBOM entry and dependency owner.
5. Keep the mirrored copy read-only except through a reviewed update process.
6. Update only by explicit approval after diff, security and license review.
