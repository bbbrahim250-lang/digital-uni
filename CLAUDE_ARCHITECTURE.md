# Digital-UNI Architecture Boundary for Claude Code

Read this before changing architecture.

## Three separate systems

1. **Digital-UNI AI Model**
   - Standalone, independently versioned model artifact/service.
   - It is NOT the Digital-UNI website or mobile app.
   - It is NOT Build-AI Studio.
   - Web/Desktop, Mobile App, and Build-AI Studios are consumers of this model through a stable adapter/API contract.
   - Do not embed, rename, or redefine the core model inside a Studio or UI module.

2. **Build-AI — Five Studios**
   - Application/workflow layer that uses the Digital-UNI AI Model.
   - Studios do not own the model.
   - Complete the five-studio experience on BOTH Web/Desktop and Digital-UNI App before release.

3. **Digital-UNI Products**
   - Web/Desktop and Digital-UNI App are product surfaces.
   - They may call the standalone model and the Studios, but must remain deployable/versioned independently.

## Release gate

DO NOT publish, merge to production/main, or deploy until:
- all 5 Build-AI Studios are complete on Web/Desktop;
- all 5 Build-AI Studios are complete on the Digital-UNI App;
- the standalone Digital-UNI AI Model interface/version is defined and tested;
- cross-platform integration tests pass;
- Brahim explicitly approves publication.

## Current work mode

- Review branches only.
- No production deployment.
- No silent architecture consolidation.
- Preserve the FAA/OSIRIS work separately unless specifically requested.
