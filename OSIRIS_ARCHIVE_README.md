# Digital-UNI OSIRIS Source Archive

Purpose: preserve controlled copies of approved third-party OSIRIS revisions used or evaluated by ABRAHAM / Digital-UNI, even if an upstream repository is later renamed, rewritten, made unavailable, or deleted.

## Archive rule

- Snapshots are additive and immutable by policy.
- Existing `snapshots/<commit-sha>/` directories must never be overwritten or deleted during normal updates.
- `CURRENT.txt` points to the newest upstream revision captured by the automated monitor.
- Every snapshot preserves the upstream LICENSE and source tree.
- Every snapshot includes `UPSTREAM_PROVENANCE.md` and `UPSTREAM_ARCHIVE_SHA256.txt`.
- Third-party origin and license attribution must not be removed or disguised.

## Tracked upstreams

### OSIRIS Global Intelligence
- Upstream: https://github.com/jukaben32/Osiris
- License: MIT
- Baseline approved SHA: `5c992c27e9c40645c58f6b845b174f6fed489d9f`
- Archive path: `third_party/osiris-global/snapshots/`

### Osiris Agent Memory / Provenance
- Upstream: https://github.com/asuramaya/osiris
- License: GNU AGPL-3.0
- Baseline approved SHA: `4c781169fe7e6dfb3ec4b302e2ba7dfa1cda10d7`
- Archive path: `third_party/osiris-memory/snapshots/`

## Integration boundary

These archived copies are dependencies/evaluation sources, not the ABRAHAM safety-authority core.

- MIT OSIRIS: candidate public-data / situational-awareness adapter.
- AGPL Osiris: candidate separate MCP/HTTPS provenance-memory service.
- ABRAHAM retains K1-K10 scoring, 4D trajectory logic, safety/confidence gates, and human-controller authority.

## Updating

The GitHub Actions workflow on the default branch checks upstreams daily. If the upstream HEAD changes, it creates a new SHA-addressed snapshot on this archive branch. Old snapshots remain untouched.

If an upstream becomes unavailable, the workflow must leave the existing archive unchanged and report the failure rather than deleting anything.
