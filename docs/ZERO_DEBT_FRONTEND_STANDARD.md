# RHI UX zero-debt frontend standard

## Purpose

This document owns the transversal frontend rules for Robotix Home Intelligence. Product packaging, canonical native interfaces, contract retirement and release policy follow the central [RHI Repository & Pipeline Contract](https://github.com/npinguin/robotix-home-intelligence/blob/main/standards/RHI_REPOSITORY_PIPELINE_CONTRACT.md).

The goal is not another abstraction layer. The goal is one clear change boundary between backend truth and user experience so a semantic change is mapped once and does not require repairing multiple independent UX flows.

## Architecture

```text
Current canonical domain backend interfaces
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

1. **UX follows the current canonical backend interface.**
   - For an integrated product, frontend and backend are changed, tested and released from the same source candidate. No independent same-product backend compatibility matrix or version-selection adapter.
   - A backend interface change includes all affected UX consumers and producer/consumer tests in the change boundary. Missing semantics are fixed by the owning backend, not reconstructed by UX.
   - Retire established-domain public V1 interfaces and superseded aggregate Public V2/V3 paths according to the central migration standard. Their presence is a migration gap, not permission for permanent fallback. First-generation input/internal schema version labels are not legacy by definition.
   - Cross-domain producers remain independently deployable; use their current supported canonical public interface, validate explicit compatibility, and fail closed on absence or incompatibility. Do not force lockstep upgrades or guess a fallback.

2. **Backend truth is not reconstructed in UX.**
   - If required meaning cannot be mapped deterministically from the current canonical backend interface, record an owning backend gap.
   - Unknown, unavailable, not configured and unsupported remain distinct.

3. **One canonical access boundary per producer.**
   - Use native canonical HA devices/entities, domain-owned properties and authorized commands, and bounded backend-owned queries where necessary.
   - A thin gateway/projection maps backend presentation once for domain screens. No screen-level discovery, alternative transport or reconstructed semantic snapshot.
   - Do not introduce a new aggregate contract just for UX. No fallback to superseded interfaces.

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
| Cross-domain fact | Producer current canonical interface |
| Domain projection | Domain UX |
| Domain product wording | Domain UX localization resources |
| Shared localization mechanics / formatting | RHI UX Core |
| Shared component geometry and interaction | RHI UX Core |
| Technical diagnostics presentation | Core grammar + domain diagnostic content |
| Release qualification | Owning package, bound to immutable candidate SHA |

## Anti-drift release gates

A domain release is not transferable until it can prove:

- zero retired public interface dependencies and completion of established-domain public V1 retirement;
- one canonical access boundary per consumed producer, tested against the actual current backend candidate;
- no separate same-product UX compatibility lane in integrated packages;
- zero screen-level Home Assistant state/contract discovery;
- zero fallback to superseded cross-domain publications or indexes;
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
