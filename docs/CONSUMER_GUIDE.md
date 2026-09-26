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
