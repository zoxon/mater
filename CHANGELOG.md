# @zoxon/mater

## 1.1.0

### Minor Changes

- Harden rendering against common mistakes.

  - Reject inline event handler attributes (`on*`) and `javascript:` / `vbscript:` URLs in URL attributes, in templates, `attrs=` and JSX.
  - Only render real `TemplateResult` instances as nested templates; TemplateResult-shaped plain objects now throw.
  - Validate tag names in `jsx()` and throw `TypeError` on cyclic iterables.
  - Stop treating `name=` in text content as an attribute.

## 1.0.0

### Minor Changes

- Initial standalone release.
