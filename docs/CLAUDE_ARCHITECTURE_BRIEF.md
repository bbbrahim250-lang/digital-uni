# Claude AI / Claude Code — Digital-UNI Architecture Brief

Use this brief as persistent project context.

Digital-UNI has three distinct layers that must never be conflated:

**A. Digital-UNI Product**
- Web/Desktop and Digital-UNI App.
- User-facing product surfaces.
- Consume services and model outputs.
- Do not own the core AI model.

**B. Build-AI Five Studios**
- Five independent workflow/tooling studios.
- Use the Digital-UNI AI Model through a stable adapter/API.
- Studios are not the model and must not silently replace it.

**C. Digital-UNI AI Model**
- Independent, versioned core artifact/service.
- Separate lifecycle, provenance, tests, compatibility rules, release history, and rollback.
- Should remain usable by Web/Desktop, App, or Studios without being embedded into any one of them.

Dependency direction:
```
Digital-UNI Web/Desktop ─┐
Digital-UNI App ─────────┼──> Model Adapter/API ──> Digital-UNI AI Model
Build-AI Five Studios ───┘
```

Rules:
1. Never call a Studio, UI component, model registry screen, prompt template, or orchestrator "the Digital-UNI AI Model."
2. Never place model weights or core model implementation inside Web/Desktop or App code unless explicitly approved as a packaging exception.
3. Pin approved model versions and preserve provenance.
4. Keep interfaces stable so backend/model versions can change without redesigning the product UI.
5. Maintain explicit human approval gates for releases.
6. FAA/OSIRIS is currently parked and remains separate unless explicitly reactivated.

Publication gate:
Nothing goes to production until all five Build-AI Studios are complete for BOTH Web/Desktop and the Digital-UNI App, integration tests pass, model compatibility is verified, and Brahim gives explicit approval.

When beginning a task, Claude should identify the affected layer and avoid unintended cross-layer changes.
