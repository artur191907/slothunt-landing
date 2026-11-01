# Claude Code subagents

Curated from [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) (MIT, commit `b37b5bb`), see `agents/LICENSE-agency-agents`.
Picked for a Next.js + Tailwind marketing landing page.

| Agent | Use for |
|---|---|
| Frontend Developer | React/Next.js components, responsive layout, performance |
| Minimal Change Engineer | Small, focused fixes without scope creep |
| UI Designer | Visual design, components, design tokens |
| UX Architect | Page structure, CSS architecture, layout foundations |
| Brand Guardian | Consistent tone, visual identity, positioning |
| SEO Specialist | Meta tags, structured data, Core Web Vitals, content |
| Content Creator | Landing copy, headlines, CTAs |
| Growth Hacker | Conversion funnel, lead capture, experiments |
| Accessibility Auditor | WCAG checks, contrast, keyboard and screen reader |
| Performance Benchmarker | Lighthouse, bundle size, load time |
| Reality Checker | Evidence-based go/no-go review before release |

Claude Code picks these up automatically from `.claude/agents/`. Ask for one by name, for example
"use the SEO Specialist agent to audit pages/index.js".

## Plugins

`.claude/settings.json` enables the [HyperFrames](https://github.com/heygen-com/hyperframes) plugin (HeyGen, Apache-2.0).
It renders MP4 video from HTML/CSS animations: promo clips, hero videos, short ads.
Claude Code installs it when you open and trust this folder. Use it with `/hyperframes:hyperframes`.
Rendering needs Node 22+, ffmpeg and Chromium on the machine that runs it.
