---
name: Screenshot-free Lighthouse
description: Measuring page performance without capturing screenshots, and the resulting score limitation.
---

When a user forbids taking screenshots, Lighthouse's default mobile run is not suitable: its trace normally records JPG frame screenshots, and the default config also collects a full-page screenshot.

**Why:** A screenshot-free run that removed the screenshot trace category, full-page screenshot gatherer, and screenshot audits produced usable LCP, CLS and TBT metrics, but Lighthouse returned a null overall Performance score. Do not report an invented score or imply this is equivalent to a standard Lighthouse score.

**How to apply:** For such requests, suppress every screenshot source before running Lighthouse, report the measured individual metrics and state that the score is unavailable under the no-screenshot constraint. Run a standard Lighthouse score only if the user permits screenshot capture.

For local production-build audits, use a Chrome-safe free port. Port 5061 is blocked as `ERR_UNSAFE_PORT` (the X11 reserved range); Lighthouse then returns `CHROME_INTERSTITIAL_ERROR` and null audit values rather than usable metrics.

**Why:** A shell HTTP check of the server can return 200 while Chrome refuses to navigate to its port, so repeated Lighthouse attempts misleadingly appear to be page-performance failures.

**How to apply:** Check `lhr.runtimeError` and reject the run if present. Choose a free port Chrome permits (5077 worked here) before interpreting missing metrics or computing a median.