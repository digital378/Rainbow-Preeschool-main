---
name: Native HTML pattern validation
description: Modern browser pattern attributes use Unicode v mode, unlike ordinary JavaScript regular expressions.
---

Validate HTML input `pattern` strings with Unicode `v` mode, not only a default JavaScript regex. Character-class punctuation such as parentheses and hyphens needs the escaping required by that mode.

**Why:** A callback phone pattern looked valid as an ordinary regex but modern Chromium rejected it; the browser then ignored that native constraint.

**How to apply:** Check the exact generated attribute using `new RegExp(pattern, "v")`, then confirm `input.validity.patternMismatch` with valid and invalid samples. Keep separate client and server validation; native browser constraints are not a server-side security boundary.