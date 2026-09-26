# RHI UX Core architecture

## Purpose

RHI UX Core is the shared **presentation foundation** for RHI domain frontends. It is not a domain runtime and not a Home Assistant integration.

## Ownership boundary

| Layer | Owner |
| --- | --- |
| Backend facts and semantics | Domain backend |
| Contract normalization | Domain UX runtime adapter |
| User-facing interpretation | Domain projection/view model |
| Screen composition and interactions | Domain UX screen |
| Shared visual grammar and UI primitives | RHI UX Core |

## Hard rules

1. Core has no Home Assistant entity IDs, contract IDs or domain facts.
2. Core may display values supplied by a domain, but may not infer their meaning.
3. Missing values render as unavailable; Core never converts missing values to zero.
4. Consumers bundle Core at build time. Core is never a required HA runtime resource.
5. A domain may add screen-specific layout, but must not fork shared token/component definitions.
6. Shared component changes are versioned in Core and adopted explicitly by consumers.
7. Git history stores old visual implementations; production stylesheets do not carry version-specific override sediment.

## Public v1 primitives

- rhiUxDomainShell
- rhiUxPageHero
- rhiUxStatusGrid / rhiUxStatusItem
- rhiUxState
- rhiUxConclusion
- rhiUxTechnicalFooter
- rhiUxEscape / rhiUxDisplay
- shared tokens and responsive component styles


## Navigation contract

Shared shell navigation uses one neutral DOM attribute: `data-nav`. Domain routers may interpret the target path, but domain packages must not fork the shell markup solely to introduce a different navigation attribute.
