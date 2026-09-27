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
