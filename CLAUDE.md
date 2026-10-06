# Digital-UNI architecture rules for Claude

These rules are mandatory for Claude Code work in this repository.

## Three separate systems

1. **Digital-UNI Product**
   - Web/Desktop and Digital-UNI App are product clients.
   - They may present UI, collect approved inputs, call approved services, and display outputs.
   - They do not own the Digital-UNI AI Model.

2. **Build-AI Five Studios**
   - The five studios are workflow/tooling applications.
   - They may orchestrate tasks and call an approved model interface.
   - They do not contain, redefine, overwrite, or become the Digital-UNI AI Model.

3. **Digital-UNI AI Model**
   - This is a standalone model artifact/service with its own version, contract, provenance, tests, and release lifecycle.
   - It must remain separable from both Digital-UNI Product and Build-AI Studios.
   - Product code must reference an approved model version through an adapter/API boundary rather than embedding model implementation or weights in the product repository.
   - Do not label a UI component, registry entry, orchestrator, prompt set, or studio workflow as the model itself.

## Integration boundary

Expected dependency direction:

Digital-UNI Web/Desktop -> Model Adapter/API
Digital-UNI App -> Model Adapter/API
Build-AI Five Studios -> Model Adapter/API
Model Adapter/API -> approved Digital-UNI AI Model backend/version

The Digital-UNI AI Model must not depend on Web/Desktop or App UI code.

## Model contract

Every approved model version should expose or document:
- model_id
- semantic version
- backend/provider reference
- capability manifest
- input/output schema
- provenance
- test evidence
- compatibility matrix
- rollback target
- immutable release checksum when applicable

If proprietary or fine-tuned model weights are created later, store/version them as separate controlled model artifacts. Do not commit large model weights to the Digital-UNI product repository.

## Release gate

DO NOT publish, merge to production, or deploy Digital-UNI changes until all of the following are true:
- all five Build-AI Studios are completed for Web/Desktop;
- all five Build-AI Studios are completed for the Digital-UNI App;
- Web/Desktop tests pass;
- App tests pass;
- model integration/version compatibility is verified;
- Brahim explicitly approves publication/deployment.

Development may continue on review branches.

## Current scope

FAA/OSIRIS work is parked unless explicitly reactivated.
Do not merge unrelated FAA work into Digital-UNI product or Build-AI studio changes.

## Before making a substantial change

State which layer you are changing:
- PRODUCT-WEB
- PRODUCT-APP
- BUILD-AI-STUDIO
- AI-MODEL-CONTRACT
- MODEL-ADAPTER
- OTHER

If a proposed change crosses layers, explain the boundary and keep implementation modular.
