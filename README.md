# RHI UX Core

Shared **build-time** UX foundation for Robotix Home Intelligence frontends.

RHI UX Core owns the visual grammar and presentation primitives used by domain UX packages such as Energy and Mobility. It deliberately does **not** own domain semantics, Home Assistant entity IDs, backend contracts, planning logic, charging logic, or other domain behavior.

## Architectural rule

```
backend public contract
        ↓
domain runtime gateway
        ↓
domain projection / view model
        ↓
domain screen
        ↓
RHI UX Core primitives + tokens
```

Consumers bundle the selected RHI UX Core version into their own immutable UX artifact. There is no Home Assistant runtime dependency on a separate Core resource.

## v1 scope

- canonical Robotix.be company branding and logo asset
- design tokens
- responsive breakpoints
- shared page/shell geometry
- page hero
- status grid / status item
- quick actions
- empty / unavailable / attention states
- section and data-row primitives
- conclusion and technical footer
- basic value formatting helpers
- maintainability and test rules

## Ownership

**Core owns how shared UI looks and behaves as UI, including canonical company branding.**

**Domain UX owns what domain information means.**

A screen must not use RHI UX Core to infer domain state. Domain-specific semantics belong in the domain projection/view-model layer.

## Consumer rule

A consuming package pins a Core version during development/build and includes the relevant Core source in its own built artifact. The canonical Robotix company logo is sourced only from Core; domain repositories must not maintain a second branding authority. Energy and Mobility may move between Core versions independently.
