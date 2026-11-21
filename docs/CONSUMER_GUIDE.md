# Consumer guide

A domain UX pins a known Core release during development and vendors/bundles its artifacts into the domain's own deterministic build.

Recommended flow:

```
rhi-ux-core@1.x
   ↓ build-time copy/bundle
domain source + domain projections
   ↓
self-contained domain dist artifact
```

Do not reference `/hacsfiles/rhi-ux-core/...` at runtime.

## Adoption sequence

Read the [normative household-first UX and anti-drift rules](ZERO_DEBT_FRONTEND_STANDARD.md#ux-hierarchy--household-first-compact-and-actionable) first. Reuse the working Basic/Premium user journey; do not introduce another navigation or information hierarchy.

1. Map local tokens to the `--rhi-*` vocabulary.
2. Replace shared hero/status/empty/footer markup with Core primitives.
3. Remove superseded local CSS immediately.
4. Keep domain-specific content and semantics in domain view models.
5. Run the domain's own preflight plus visual/runtime qualification.

A migration is not complete while both local and Core implementations remain active.


## Navigation

`rhiUxDomainShell()` emits `data-nav` for module and item targets. Consumers should attach their domain router to this attribute rather than rewriting shared shell markup.


## Cross-domain navigation

Producer UX packages may register an optional asset-detail route template with `rhiUxRegisterDomainNavigation()`. Consumer UX packages resolve it with `rhiUxResolveDomainAssetNavigation(owner_domain, asset_id)`.

Rules:
- Core owns only the generic browser-side registry mechanism.
- The producer UX owns its route shape and current dashboard root.
- Consumers never hardcode another domain's dashboard path or query grammar.
- Registration is optional; absence means no cross-domain navigation action is rendered.
- Templates are same-origin relative paths and must contain `{asset_id}`.

## Shared shell and Hero conformance (central authority)

The existing `rhiUxDomainShell`, `rhiUxPageHero`, navigation, typography and responsive layout are **one shared component family**, not merely a set of reusable class names. The canonical CSS in `src/primitives.css` owns header, Hero and navigation dimensions; `src/visual-spec.json.shared_layout` records the tested breakpoints and protected selectors. The visual-library `hero_scene` master is 2400 × 800 (3:1), with a left-side copy-safe area and an explicit focal point. The domain supplies its own properly licensed, local, responsive artwork and EN/NL/FR copy. The image must be decorative and must never imply data or status.

A domain **must not redefine** any `shared_layout.protected_consumer_selectors` selector, even under its own `.planning-card` or `.notify-standalone` namespace or a media query. Domain CSS may style its own lists, cards and specialized states, not override shared Hero heights, title font, copy widths, background fade, shared shell/header or navigation. Change shared geometry here first, then pin/adopt the validated version in existing domain PRs. Embedded cards must not render standalone header/Hero chrome.

Validate the actual *authored* CSS in normal product source checks, not the vendored Core CSS:

```sh
node tools/check-consumer-style.mjs path/to/domain.css
node tools/check-consumer-style.mjs frontend/planning-card.js PLAN_CSS
node tools/check-consumer-style.mjs frontend/notifications-card.js NOTIFY_CSS
```

The tool is build-time only and reads a static JSON-escaped CSS constant without executing product JS; existing consumers can vendor the single pinned check tool as needed. A source pass does not replace final HA/Chromium screenshots at 390×844, 1024×768 and 1600×900 or a proven first safe action. Audit existing module overrides before pinning; do not hide them by changing the shared stylesheet locally.
