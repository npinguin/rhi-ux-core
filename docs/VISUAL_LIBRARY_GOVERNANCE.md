# RHI Visual Library Governance v1

## Purpose

RHI UX Core defines the shared visual-library grammar for all Robotix Home Intelligence UX packages. Domain UX packages remain self-contained: they own and ship their own hero artwork, product artwork, generic fallback artwork, catalogs and manifests.

Core defines **how visuals are classified and validated**, not which domain products exist.

## Ownership

### RHI UX Core owns
- visual classes and canonical dimensions;
- shared quality taxonomy;
- provenance/search metadata requirements;
- hero focal-point and safe-area grammar;
- generic anti-drift rules;
- shared rendering primitives.

### Domain UX packages own
- domain concepts and asset types;
- brand, model, generation, variant and SKU metadata;
- hero artwork;
- product-specific artwork;
- generic fallback family artwork;
- domain visual catalogs and coverage matrices;
- package-local binaries.

### Foundation/runtime registries
Cross-domain registries may publish producer-owned visual references and presentation metadata, but do not own or copy producer artwork.

## Self-contained package invariant

A domain UX package must remain installable and render its own visuals without a runtime dependency on RHI UX Core or another domain UX package.

Consumers may bundle a pinned Core version at build time. Artwork remains package-local and is served from the owning package's existing HACS path.

Core must never contain domain-specific brands, models, SKUs, asset types or product binaries.

## Visual families

Every domain visual belongs to exactly one family.

### 1. Hero family

Page-level storytelling and identity.

- visual class: `hero_scene`
- canonical master: 2400 x 800 px
- aspect ratio: 3:1
- composition: quiet copy-safe area on the left; primary subject center-right/right
- metadata: focal point and copy-safe area required
- hero artwork must not be used as a generic asset fallback

### 2. Product-specific family

Verified or representative product artwork used in cards, detail views and pickers.

Visual class depends on object geometry:

- `product_wide`: 1600 x 950 px, transparent
- `product_square`: 1400 x 1400 px, transparent
- `product_landscape`: 1600 x 1200 px, transparent

A domain may define an additional visual class only when the shared classes cannot preserve consistent scale or cropping. Such an extension must be documented and validated locally.

### 3. Generic fallback family

A coherent domain-owned fallback set for logical types that have no exact product artwork.

Generic fallbacks:
- are not hero images;
- do not masquerade as a verified real product;
- must visually belong to one consistent family within the domain;
- must use one of the canonical product visual classes;
- remain package-local.

## Quality taxonomy

The shared quality values are:

- `verified_product`: exact real product/model is confirmed.
- `verified_appearance`: exact product and exact visual appearance/colour are confirmed.
- `representative_brand`: brand is correct, exact model is not guaranteed.
- `representative_generic`: logical type is correct, no product identity is claimed.
- `generic_family`: official domain generic fallback artwork.
- `derived_appearance`: derived from another master, for example by colour transformation.
- `deprecated`: retained only for migration/history and not selectable for new use.

A `verified_product` or `verified_appearance` entry must never point to generic-family artwork.

## Product search and provenance

Product artwork discovery follows this search order:

1. exact SKU;
2. brand + exact model;
3. brand + type/variant;
4. official manufacturer product page or datasheet;
5. authorised/reliable distributor or reseller;
6. generated/derived representation only when source imagery is inadequate or redistribution is unsuitable.

Every product-specific entry must retain enough metadata to reproduce the search:
- primary search key;
- optional secondary search key;
- brand;
- model;
- variant;
- SKU when available;
- source kind;
- source/provenance reference;
- redistribution/reuse status where relevant.

## Manifest contract

Each domain maintains one machine-readable visual manifest as its local source of truth. Runtime catalogs should be generated from it or validated against it.

A manifest entry must expose, where applicable:

- `id`
- `family`
- `visual_class`
- `asset_type`
- `brand`
- `model`
- `variant`
- `sku`
- `quality`
- `package_path`
- `width`
- `height`
- `transparent_background`
- `search_key_primary`
- `search_key_secondary`
- `source_kind`
- `provenance`
- `status`

Hero entries additionally define:
- `hero_key`
- `focal_x`
- `focal_y`
- `safe_left`
- `safe_right`

## Required anti-drift invariants

Domain CI must prove:

1. every packaged visual file is represented in the domain manifest or explicitly marked as non-library branding/support media;
2. every manifest path exists in the package;
3. runtime catalogs do not reference missing files;
4. each supported logical asset type has a same-type generic fallback unless the type is producer-owned and its fallback policy explicitly says otherwise;
5. product artwork and generic fallbacks do not use `heroes/` paths;
6. hero assets satisfy the canonical hero dimensions and metadata;
7. product assets satisfy their declared visual-class dimensions;
8. quality labels match the represented artwork;
9. deprecated entries are not selected by default;
10. docs, manifest and runtime catalogs cannot silently diverge.

## HACS/package structure invariant

This governance does not change the existing HACS delivery model.

- Core remains a build-time dependency.
- Domain UX packages keep their existing package roots and HACS URLs.
- Domain assets stay under their own package asset root.
- No central media runtime dependency is introduced.
- Release versioning is performed only when a complete, validated consumer change is ready for publication.

## Change workflow

For each new or replaced visual:

1. identify the owning domain and logical asset type;
2. classify it as hero, product-specific or generic fallback;
3. search product imagery using SKU -> brand/model -> brand/type;
4. create or normalize the canonical master;
5. record quality, dimensions and provenance in the domain manifest;
6. update the domain coverage matrix;
7. run visual governance, coverage and package parity validation;
8. perform visual review before release.

## Frozen decisions

The following decisions are intentionally stable:

1. UX packages remain self-contained.
2. Core owns the visual grammar, not domain content.
3. Hero, product and generic fallback families remain separate.
4. Hero artwork is never the generic fallback implementation.
5. Product discovery starts from SKU/brand/model metadata.
6. Domain manifests are the local visual source of truth.
7. CI must block visual-library drift before release.
