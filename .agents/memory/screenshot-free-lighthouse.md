---
name: Screenshot-free Lighthouse
description: Measuring page performance without capturing screenshots, and the resulting score limitation.
---

When a user forbids taking screenshots, Lighthouse's default mobile run is not suitable: its trace normally records JPG frame screenshots, and the default config also collects a full-page screenshot.

**Why:** A screenshot-free run that removed the screenshot trace category, full-page screenshot gatherer, and screenshot audits produced usable LCP, CLS and TBT metrics, but Lighthouse returned a null overall Performance score. Do not report an invented score or imply this is equivalent to a standard Lighthouse score.

**How to apply:** For such requests, suppress every screenshot source before running Lighthouse, report the measured individual metrics and state that the score is unavailable under the no-screenshot constraint. Run a standard Lighthouse score only if the user permits screenshot capture.