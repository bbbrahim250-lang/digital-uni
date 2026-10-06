# ABRAHAM FAA — OSIRIS Interoperability Integration Plan

## Objective

Evaluate two open-source OSIRIS projects as isolated, non-authoritative subsystems that strengthen ABRAHAM's FAA research demonstrator without weakening safety, licensing, provenance or human-controller authority.

## Target architecture

```text
Public / research data
        |
        v
OSIRIS Global Intelligence (MIT, pinned)
        |
        | REST / normalized event feed
        v
ABRAHAM External Data Gateway
        |
        +--> K4 Tracking + 4D Trajectory
        +--> K5 RF/MIMO + Surveillance Integrity
        +--> K6 Cyber / Source Trust
        +--> K9 Interoperability & Decision Assurance
        +--> K10 Scalability / Global Scenario View
        |
        v
ABRAHAM 10D Safety + Confidence Gate
        |
        v
Human Controller Role — Simulation
ACCEPT | MODIFY | REJECT | TAKE OVER

ABRAHAM Provenance Adapter
        |
        | MCP / HTTPS
        v
Osiris Agent Memory Service (AGPL, pinned, separate container)
        |
        +--> facts / decisions / confidence
        +--> source provenance
        +--> event history / audit reconstruction
```

## Phase 0 — safety and license isolation

Do not import either codebase into ABRAHAM core.

Create adapters behind feature flags:
- `OSIRIS_GLOBAL_ENABLED=false`
- `OSIRIS_MEMORY_ENABLED=false`

Default operation must be ABRAHAM-only. A failure, timeout, malformed record or unavailable OSIRIS service must degrade gracefully and must not change a controller decision.

## Phase 1 — MIT global-intelligence adapter

Implement an adapter that accepts a narrow normalized aviation event schema:

```ts
type ExternalObservation = {
  sourceSystem: "osiris-global";
  sourceRef: string;
  observedAt: string;
  receivedAt: string;
  entityType: "aircraft" | "weather" | "satellite" | "network-context";
  entityId: string;
  latitude?: number;
  longitude?: number;
  altitudeFt?: number;
  velocityKt?: number;
  headingDeg?: number;
  rawConfidence?: number;
  schemaVersion: string;
};
```

Derive inside ABRAHAM, not OSIRIS:
- Age of Information;
- source trust;
- 4D-trajectory confidence impact;
- sensor disagreement;
- K9 provenance fields.

Never represent public OpenSky-derived observations as FAA surveillance data.

## Phase 2 — AGPL memory/provenance adapter

Integrate only by MCP/HTTPS to a separately deployed service.

Minimum record model:
- aircraft / scenario identifier;
- timestamp;
- K1-K10 state snapshot;
- 4D-trajectory confidence;
- source references and observation age;
- recommendation;
- reason;
- confidence;
- ABRAHAM mode;
- human action;
- outcome;
- software build / model version.

ABRAHAM is the system of record for safety logic. Osiris is an external provenance store only.

## Phase 3 — K9 Interoperability & Decision Assurance tests

Add tests for:
1. source timestamp preservation;
2. schema-version mapping;
3. provenance chain reconstruction;
4. timeout and unavailable-service handling;
5. malformed-event rejection;
6. duplicate-event idempotence;
7. confidence not increased merely because data came through OSIRIS;
8. AGPL memory failure cannot alter ABRAHAM decision output;
9. human decision remains authoritative;
10. audit reconstruction from ABRAHAM + optional external provenance.

## Phase 4 — FAA demonstrator UI

Optional visual layer:
- OSIRIS-style global map / airport context;
- selected-aircraft 4D projected path;
- ABRAHAM K1-K10 panel;
- TDM / All-IP / FENS-style network state;
- controller decision queue;
- provenance drawer showing source, age, confidence and adapter status.

Every screen must visibly label public/simulated sources and distinguish them from authorized FAA data.

## Acceptance criteria

Integration is accepted only when:
- existing ABRAHAM tests remain green;
- new adapter tests pass;
- ABRAHAM runs with both OSIRIS services disabled;
- no AGPL source is copied into proprietary ABRAHAM modules;
- license notices and pinned SHAs are recorded;
- provenance can reconstruct an advisory and subsequent human action;
- OSIRIS failure cannot produce or authorize an ATC action;
- screenshots of the new test results are retained for the FAA evidence appendix.

## Deployment rule

Do not deploy to production or merge to `main` until owner review. Build and test on an isolated branch first.
