# Home Intelligence product maturity

## North star

Robotix Home Intelligence is not mature because a contract exists, a screen renders, or CI is green. It is mature only when the household can rely on the complete product journey on the target Home Assistant installation.

The product direction is:

> Home Intelligence understands the household, keeps things on track automatically, explains what matters, and asks for attention only when a human decision is useful.

## Product decision loop

Shared experiences should converge on:

```text
Observe
  ↓
Understand
  ↓
Decide
  ↓
Act
  ↓
Learn
```

User-facing equivalents are:

- What is happening?
- Why does it matter?
- What will happen next?
- Do I need to do anything?
- Did the outcome match the intention?

Core owns reusable presentation/interaction grammar for these concepts. Domain backends and domain UX packages retain ownership of domain facts and semantics.

## Maturity gate

A capability is **not mature** merely because it is structurally implemented.

For a capability to count toward product maturity, all applicable conditions must hold:

1. the authoritative public backend contract is available on the target Home Assistant;
2. the domain projection/view model consumes that contract without reconstructing domain truth;
3. the user journey works end-to-end with real data;
4. user actions persist through canonical readback where applicable;
5. refresh/reload/restart preserves the intended state;
6. desktop/tablet/mobile behavior is usable;
7. error, unavailable, zero and null states are explicit;
8. upgrade and rollback are proven for the immutable candidate;
9. the capability is integrated into a coherent product journey rather than exposed as an isolated pilot surface;
10. target-runtime evidence is recorded before stable/mature claims are made.

CI, deterministic packaging and static contract tests are required engineering gates, but they do not substitute for target-runtime product proof.

## Pilot-feature rule

A pilot feature may exist while learning, but it must be classified explicitly. Before a mature/stable product milestone it must be one of:

- integrated into a coherent user journey and runtime-qualified;
- deliberately hidden/feature-gated;
- removed.

A visible but unqualified standalone feature is product debt even when its source code is clean.

## Shared intelligence grammar

Future Core evolution should support reusable presentation patterns for:

- status;
- attention;
- opportunity;
- recommendation;
- explanation / Why?;
- expected outcome;
- action / override;
- actual outcome;
- unavailable / contract-gap state;
- configuration write + canonical readback;
- progressive disclosure of technical evidence.

Core does not calculate or infer these meanings. It renders domain-supplied meaning consistently.

## Next steps

1. Align Energy and Mobility around the shared product decision loop.
2. Promote only proven cross-domain UX patterns into Core.
3. Rationalize shared navigation and interaction patterns without moving domain semantics into Core.
4. Add product-journey qualification to release governance in consumer packages.
5. Treat target Home Assistant evidence as mandatory for mature/stable product claims.
