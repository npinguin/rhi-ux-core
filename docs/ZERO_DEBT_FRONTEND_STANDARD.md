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

## UX hierarchy — household-first, compact and actionable

**Normative across Home, Core, Basic and Premium.** This consolidates the established user-approved Basic and Premium interaction patterns; it is not a new UX architecture. Use the current working Basic views (particularly Home) as the functional and usability reference, and the qualified Premium asset presentation as an additional reference. Reuse before redesign; do not impose the current Core screen layout on working consumers.

### Perspective and user flow

| Perspective | Overview and attention | Action and Settings | History & Insights |
| --- | --- | --- | --- |
| Home | What is happening? What needs attention? | What can I do now? Contextual household preferences where appropriate. | What happened? |
| Notifications | What happened? What matters or needs attention? | Act on an incident; choose which events matter, their importance, and who/which channels should notify me. | Events, incidents and actual delivery evolution. |
| Planning | What is happening or coming up? What needs attention? | Act on a plan; decide what should automatically happen and when. | Planned versus observed execution, where qualified. |
| Finance | What is happening/consumed? What does it cost? | Act on relevant cost information; configure prices and costs that can be influenced to save. | Actual usage, costs, revenue and separately labelled forecast. |
| Functional domains | What is happening to my assets? What needs attention? | Direct domain-owned controls and preferences. | Relevant facts, trends and context. |

The common flow is **Insight → Attention → Action → Settings → History & Insights**. These are user tasks, not mandatory separate pages, steps or a wizard. An action belongs with its status and object. The normal user does not need to understand Home Assistant or RHI contract mechanics.

### Information and navigation structure

- Use the same qualified semantic hierarchy: household → domain → asset group → asset → source, omitting unnecessary levels. Home combines domains; standalone Notifications, Finance and Planning present a different perspective on the same domains, not a new taxonomy. Foundation remains headless.
- Preserve the existing navigation and information hierarchy: overview first, useful actions next to their status, domain/asset content, settings and history where applicable. Global Overview and Settings use compact, foldable domain rows. A row identifies the domain and exposes its relevant state, attention and common actions/settings; expansion shows the next useful level. Order groups by relevance to the task (e.g. next qualified activity in Planning). Keep known critical attention visible when collapsed. No arbitrary domain order, fabricated categories, empty groups or forced full-bundle navigation.
- Use actual qualified domain/asset relationships and stable identities, not inferred names or a duplicate inventory. In an already scoped domain or asset view, retain that scope rather than making the user select it again. Distinguish household-wide and unassigned items; show common settings once at their rightful owner (recipient/channel preferences, shared tariff/recurring costs, native schedule administration). No duplicate editors or totals. A cross-scope rule is not partly editable.
- Preserve the existing shared contextual panel: **Events → Finance → Notifications → Planning**, fixed relative order, only applicable tabs, compact default-collapsed summary with direct expansion to the selected tab, same scope throughout. The summary is the header, not a second row of cards. A single applicable capability needs no redundant tab. Immediate physical controls remain outside the fold; no independent context engine or fourth Events product. The [existing Basic contextual panel contract](https://github.com/npinguin/rhi-project-wessels/blob/main/20_Engineering/HomeAssistant/Basic/docs/HA_BASIC_UX_TEMPLATE_SYSTEM_V3.md#21-shared-contextual-panel--events-finance-notifications-planning) defines the site composition reference.
- Separate navigation (change perspective or object), contextual filters (change scope/period of content) and actions (change state). Use the existing native HA navigation and shared Core primitives; no extra tab layer, dead link, or forced navigation for an inline edit. Preserve selection and a clear return path.

### Compactness, actions and progressive depth

- Maximize useful information and action density, not raw data or blank space. One recognizable title and meaningful compact status; avoid redundant product pills, decorative/empty heroes, repeated headings, refresh-only action rows and duplicate KPIs. A hero is optional and must earn its space; do not force Premium hero chrome onto native Basic or compact Core views. Keep readable typography, responsive reflow and touch targets; do not solve density by tiny fonts, clipping or horizontal scrolling.
- D0–D1: first viewport answers what is happening, what needs attention and exposes the first permitted frequent action. Show the most relevant source-backed KPIs (typically 2–4 on phone, not a fixed quota), current values and ordinary editable controls together. No mandatory wizard or extra screen for common changes; use existing inline controls and safe save/readback. Unsupported actions are absent; supported temporarily unavailable actions show the reason. Do not invent controls for a read-only view.
- D2: details/history and grouped membership are reachable via compact, normally closed rows; show meaningful summaries even when closed. D3: advanced configuration, exceptions, precise asset/endpoint selection and engineering evidence under explicit disclosure. D4: native source/device and diagnostic/readback access. Keep the same recognizable object throughout, with no unnecessary fold behind a fold. D0–D4 are information depth, not authorization tiers.
- Reuse actual Home/Basic grouping, native controls and foldable patterns, and Premium canonical asset identity, direct actions, relationships and Configuration / Details / Diagnostics where applicable. Reuse the existing Core shell, status, action, context and disclosure primitives; do not add a framework, speculative generic domain model or presentation-layer business logic. Preserve native HA safety, settings, history, scope, and authoritative readback.

### UX anti-drift evidence

For every UX-affecting PR, use the existing issue/PR and qualification record (no new checklist framework). Identify the exact AS-IS view/working release and relevant historical PRs, what is reused and what concrete defect justifies a change. Compare the same real user journeys before/after: time/clicks/scroll to first useful action, recognizable navigation and context, closed/open group and ordinary edit, readable information and reachable engineering source. Show normal, empty, unavailable and critical/attention states and actual authorized write/readback where applicable; verify phone (390×844), tablet (1024×768) and desktop (1600×900), preserving existing approved visual baselines. No regression in functional coverage, ordinary task effort or first-action visibility. A passing source check does not establish rendered usability; unexecuted runtime/field acceptance remains HOLD. Do not auto-approve changed visual baselines.

Historical reuse anchors (not release authority): Home [#402](https://github.com/npinguin/rhi-project-wessels/pull/402), [#462](https://github.com/npinguin/rhi-project-wessels/pull/462), [#478](https://github.com/npinguin/rhi-project-wessels/pull/478), [#549](https://github.com/npinguin/rhi-project-wessels/pull/549), Project [#583](https://github.com/npinguin/rhi-project-wessels/pull/583), [#584](https://github.com/npinguin/rhi-project-wessels/pull/584), Home migration [#585](https://github.com/npinguin/rhi-project-wessels/pull/585); Premium Energy [#204](https://github.com/npinguin/rhi-energy/pull/204), Mobility UX [#84](https://github.com/npinguin/rhi-mobility-ux/pull/84), [#183](https://github.com/npinguin/rhi-mobility-ux/pull/183), Multimedia [#13](https://github.com/npinguin/rhi-multimedia/pull/13). The actual current working source and field evidence remain the baseline; historic implementations do not authorize reviving retired engines.

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
- UX hierarchy and anti-drift task evidence above, including compactness, navigation/information structure, direct actions and progressive disclosure;
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
