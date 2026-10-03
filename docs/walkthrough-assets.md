# Walkthrough source assets

Setup inventory only: no page code or visuals were changed. All 21 originals are stored under `.local/walkthrough-src/`, excluded explicitly in `.gitignore` and `.replitignore`. Do not deploy these originals. Existing scene stills are preserved.

## Source measurements

Measured with FFmpeg/ffprobe 6.1.1. Actual source clips differ from the nominal dimensions in the brief: desktop **1924 × 1076**, mobile **1076 × 1924**. Every clip is **5.041667 seconds, 24 fps, 121 counted video frames**. Dimensions, rates and frame counts below are probe results, not assumed values. Container and video-stream durations agree.

## Scene mapping

Each transition listed on a scene row leads OUT of that scene and INTO the next scene. Scene 8 has no outgoing transition.

| Scene | Desktop still (public URL) | Mobile still (public URL) | Desktop outgoing source clip | Mobile outgoing source clip |
|---|---|---|---|---|
| 1 Gate | `/walkthrough/scenes/desktop/scene-1.webp` | `/walkthrough/scenes/mobile/scene-1.webp` | `.local/walkthrough-src/desktop/01-gate-to-reception.mp4` → Reception | `.local/walkthrough-src/mobile/01-gate-to-reception.mp4` → Reception |
| 2 Reception | `/walkthrough/scenes/desktop/scene-2.webp` | `/walkthrough/scenes/mobile/scene-2.webp` | `.local/walkthrough-src/desktop/02-reception-to-corridor.mp4` → Corridor | `.local/walkthrough-src/mobile/02-reception-to-corridor.mp4` → Corridor |
| 3 Corridor | `/walkthrough/scenes/desktop/scene-3.webp` | `/walkthrough/scenes/mobile/scene-3.webp` | `.local/walkthrough-src/desktop/03-corridor-to-classroom.mp4` → Classroom | `.local/walkthrough-src/mobile/03-corridor-to-classroom.mp4` → Classroom |
| 4 Classroom | `/walkthrough/scenes/desktop/scene-4.webp` | `/walkthrough/scenes/mobile/scene-4.webp` | `.local/walkthrough-src/desktop/04-classroom-to-playground.mp4` → Playground | `.local/walkthrough-src/mobile/04-classroom-to-playground.mp4` → Playground |
| 5 Playground | `/walkthrough/scenes/desktop/scene-5.webp` | `/walkthrough/scenes/mobile/scene-5.webp` | `.local/walkthrough-src/desktop/05-playground-to-theatre.mp4` → Rainbow Theatre | `.local/walkthrough-src/mobile/05-playground-to-theatre.mp4` → Rainbow Theatre |
| 6 Rainbow Theatre | `/walkthrough/scenes/desktop/scene-6.webp` | `/walkthrough/scenes/mobile/scene-6.webp` | `.local/walkthrough-src/desktop/06-theatre-to-courtyard.mp4` → Courtyard | `.local/walkthrough-src/mobile/06-theatre-to-courtyard.mp4` → Courtyard |
| 7 Courtyard | `/walkthrough/scenes/desktop/scene-7.webp` | `/walkthrough/scenes/mobile/scene-7.webp` | `.local/walkthrough-src/desktop/07-courtyard-to-aerial.mp4` → Across Thane | `.local/walkthrough-src/mobile/07-courtyard-to-aerial.mp4` → Across Thane |
| 8 Across Thane | `/walkthrough/scenes/desktop/scene-8.webp` | `/walkthrough/scenes/mobile/scene-8.webp` | None (final scene) | None (final scene) |

Still filesystem paths prepend `client/public` to each public URL above. All 16 stills were already present and remain unchanged.

## Transition video inventory

| File (relative to `.local/walkthrough-src/`) | Bytes | Duration (s) | Resolution | FPS | Counted frames | Source URL |
|---|---:|---:|---|---:|---:|---|
| `desktop/01-gate-to-reception.mp4` | 16338224 | 5.041667 | 1924 × 1076 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_044901_d04b354b-e7ba-4dec-a1d1-ec2c434cd0c3.mp4 |
| `desktop/02-reception-to-corridor.mp4` | 13626306 | 5.041667 | 1924 × 1076 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_044901_9344b43c-b44a-48ad-97e2-1634560d294f.mp4 |
| `desktop/03-corridor-to-classroom.mp4` | 13532506 | 5.041667 | 1924 × 1076 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_044901_097a3800-856f-48d7-8bde-feb17c57d946.mp4 |
| `desktop/04-classroom-to-playground.mp4` | 16433054 | 5.041667 | 1924 × 1076 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_044901_d51e9ab2-e143-4f86-86e1-ecf4316ddc29.mp4 |
| `desktop/05-playground-to-theatre.mp4` | 16436045 | 5.041667 | 1924 × 1076 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_044901_3127f100-a373-4c76-9ae3-be6e50a1f76c.mp4 |
| `desktop/06-theatre-to-courtyard.mp4` | 13297606 | 5.041667 | 1924 × 1076 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_044901_207c3d2e-705b-4d66-8745-b4e4588ee1af.mp4 |
| `desktop/07-courtyard-to-aerial.mp4` | 19270986 | 5.041667 | 1924 × 1076 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_044901_b691b8c4-8016-4b2d-a297-f97c9ce93e88.mp4 |
| `mobile/01-gate-to-reception.mp4` | 14396887 | 5.041667 | 1076 × 1924 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_042059_a6ac443a-ab71-4cfc-b5cc-c4e508d77d54.mp4 |
| `mobile/02-reception-to-corridor.mp4` | 10438869 | 5.041667 | 1076 × 1924 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_042542_2ac1061b-7691-40eb-ad80-edab7faaf22d.mp4 |
| `mobile/03-corridor-to-classroom.mp4` | 12783623 | 5.041667 | 1076 × 1924 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_042543_15cfe677-127d-43f5-b64f-35344cf06f33.mp4 |
| `mobile/04-classroom-to-playground.mp4` | 14512142 | 5.041667 | 1076 × 1924 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_042543_9a8a32a3-84e2-4868-a98f-a62b8eff800f.mp4 |
| `mobile/05-playground-to-theatre.mp4` | 14782167 | 5.041667 | 1076 × 1924 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_044901_471d08e6-da1a-4acb-9635-577b0df075dd.mp4 |
| `mobile/06-theatre-to-courtyard.mp4` | 13012692 | 5.041667 | 1076 × 1924 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_044901_537cbe53-9a94-4e1b-a374-6de14ffb38b5.mp4 |
| `mobile/07-courtyard-to-aerial.mp4` | 17012591 | 5.041667 | 1076 × 1924 | 24/1 | 121 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_042544_77e48302-9d7d-4b6a-963f-bfaf3f64ba65.mp4 |

## Counsellor originals

These PNGs and GLBs are source assets only. Before future runtime use, compress models to the project skill’s under-3 MB budget and provide an image fallback. No compression, frame extraction or UI integration was performed during setup.

Validation: all PNGs are 880 × 1168. All three GLBs are valid GLB v2 containers, but each has **zero skins and zero animations**, including the files named `counsellor-rigged-animated-a.glb` and `counsellor-rigged-animated-b.glb`. Their names do not establish that rigging or animation data exists; future animation work needs properly rigged/animated replacements or additional rigging.

| File (relative to `.local/walkthrough-src/`) | Bytes | Source URL |
|---|---:|---|
| `counsellor/counsellor-a.png` | 1152822 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_041541_810a57c9-8381-4ed9-96c7-9b03552995e9.png |
| `counsellor/counsellor-b.png` | 1159709 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_041541_fd39e3e9-e6fa-47e7-a3e0-8b1c8b911503.png |
| `counsellor/counsellor-c.png` | 1169972 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_041541_d32f88e4-f595-4519-ad01-6365c5cbe24c.png |
| `counsellor/counsellor-source.png` | 978122 | https://d2ol7oe51mr4n9.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/982d70d6-126e-4980-9f06-8bac2096c412.png |
| `counsellor/counsellor-rigged-animated-a.glb` | 12772596 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_054328_afebea53-b38c-4f57-a26d-ec773100a9b8.glb |
| `counsellor/counsellor-static.glb` | 12774000 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_053801_02aed67f-5e19-4cfa-96f0-79201f7f18ef.glb |
| `counsellor/counsellor-rigged-animated-b.glb` | 12622856 | https://d8j0ntlcm91z4.cloudfront.net/user_3GtPe5Y342R7qxGzTqdo8TSCJyk/hf_20260924_045953_cce6cc9b-e364-4fb0-8c17-2040635ca16e.glb |

Total downloaded: **21 files, 248503775 bytes (236.99 MiB)**.
