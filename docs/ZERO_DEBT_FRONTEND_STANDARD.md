# RHI UX zero-debt frontend standard

## Purpose

This document is the normative transversal frontend handover for Robotix Home Intelligence domain UX packages.

The goal is not another abstraction layer. The goal is one clear change boundary between backend truth and user experience so a semantic change is mapped once and does not require repairing multiple independent UX flows.

## Architecture

```text
Domain backend public V2 contracts
        ↓
one domain runtime gateway
        ↓
thin domain projection / presentation model
        ↓
RHI UX Core shared grammar
        ↓
domain screen composition
        ↓
user
```

Core owns presentation mechanics only. It never owns Energy or Mobility facts, policy, relationships, capability semantics or Home Assistant contract/entity knowledge.

## Non-negotiable rules

1. **V1 product/runtime interfaces are decommissioned.**
   - No V1 authority, fallback or compatibility read may exist in current domain `src/` or generated `dist/`.
   - Historical V1 names may remain only in archive/history or negative tests proving rejection.
   - A newer V2 surface may not silently fall back to V1 when data is absent.

2. **Backend truth is not reconstructed in UX.**
   - If required meaning cannot be mapped deterministically from V2, the domain UX records a backend gap.
   - The gap is fixed in the natural owning backend/domain.
   - Unknown, unavailable, not configured and unsupported remain distinct.

3. **One V2 ingress and one projection boundary.**
   - Every domain/producer exposes one canonical product V2 ingress for a consuming UX package.
   - Backend aliases and transport shape are normalized once behind the domain runtime gateway.
   - Screens consume presentation models and must not read Home Assistant state registries, discover contract entities, or inspect raw public-contract attributes themselves.
   - Cross-domain UX reads must use the producer-owned canonical V2 contract; old per-capability/index entities are forbidden even when they still exist for compatibility or diagnostics.
   - If the canonical V2 contract does not publish required evidence, the UX fails closed and records a backend contract gap. It must never recover the value from an older public index.

4. **Normal UX is human language.**
   - No contract names, entity IDs, property keys, operation IDs, raw reason codes or technical implementation wording in normal product surfaces.
   - Technical evidence belongs behind explicit Diagnostics / Engineering disclosure.

5. **Multilingual is architectural.**
   - EN/NL/FR product copy uses stable localization keys.
   - Locale formatting for numbers, currency, dates, times and percentages belongs to Core.
   - Machine identifiers remain untranslated.

6. **Core owns shared visual grammar.**
   - shell, navigation geometry, Hero, status, quick actions, context controls, generic asset grammar, common editors, typography, spacing, responsive behavior, empty/error states and diagnostics disclosure;
   - domains own domain-specific copy, semantics, diagrams, content hierarchy and projection.

7. **Writes require authoritative readback.**
   - Requested state is transient.
   - Service-call success is not confirmed product state.
   - UI confirmation requires canonical readback; persistence-sensitive settings require refresh/restart proof.

8. **Missing truth fails closed.**
   - No local arithmetic or heuristic may create backend-owned planning totals, readiness, relationships, value, eligibility or recommendations.

## UX hierarchy

```text
answer / status
    ↓
primary action
    ↓
details
    ↓
diagnostics
```

The normal user should not need to understand Home Assistant or RHI contract mechanics.

## Ownership matrix

| Concern | Owner |
| --- | --- |
| Technical evidence / platform capabilities | Foundation or owning producer backend |
| Domain facts and semantics | Domain backend |
| Cross-domain fact | Producer public V2 contract |
| Domain projection | Domain UX |
| Domain product wording | Domain UX localization resources |
| Shared localization mechanics / formatting | RHI UX Core |
| Shared component geometry and interaction | RHI UX Core |
| Technical diagnostics presentation | Core grammar + domain diagnostic content |
| Release qualification | Owning package, bound to immutable candidate SHA |

## Anti-drift release gates

A domain release is not transferable until it can prove:

- zero V1 product/runtime dependencies;
- exactly one canonical V2 product ingress per consumed domain/producer;
- zero screen-level Home Assistant state/contract discovery;
- zero cross-domain fallback to old per-capability/index entities;
- zero accepted technical debt;
- zero accepted feature debt;
- no shared Core-selector redefinition;
- no presentation priority patch sediment such as uncontrolled `!important`;
- no frontend reconstruction of backend-owned semantics;
- EN/NL/FR completeness for pilot-visible product copy;
- no raw technical identifiers on normal product surfaces;
- target Home Assistant render and write/readback evidence;
- upgrade and rollback proof;
- every blocking backend gap either closed or release remains blocked.

## Core version adoption

Consumers vendor Core at build time and pin provenance. Core is not a Home Assistant runtime dependency.

A Core upgrade is explicit:

1. pin exact Core version and source commit;
2. run domain static/regression validation;
3. reset runtime qualification where shared behavior changed;
4. prove target-runtime behavior before stable promotion.

## Handover acceptance

A new engineer must be able to answer, from repository files only:

- what is authoritative;
- what the UX may and may not infer;
- which package owns a missing semantic;
- which Core version is pinned;
- which candidate is under qualification;
- which runtime gates remain pending;
- how to build/test/package;
- how to roll back;
- where backend gaps are tracked.

If any answer requires chat history or tribal knowledge, the package is not cleanly transferable.
