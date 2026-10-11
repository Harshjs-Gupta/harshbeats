<!-- BEGIN:nextjs-agent-rules -->

# AGENTS.md — Portfolio Implementation Specification

## 0. Purpose

This file is the source of truth for AI coding agents working on this
portfolio.

Before creating, editing, refactoring, or deleting code:

1. Read this file completely.
2. Inspect the existing project structure and implementation.
3. Preserve working functionality unless a requested change requires it.
4. Implement features according to the architecture and behavior defined here.
5. Do not simplify or reinterpret the major scroll interactions.
6. Do not replace the selected visual direction with a generic portfolio design.

The goal is a premium developer portfolio combining:

- Editorial 2D interface
- Cinematic 3D storytelling
- Scroll-controlled transitions
- Strong responsive behavior
- High performance
- Accessibility

Core design principle:

> 3D creates emotion and motion.
> 2D HTML carries content, hierarchy, navigation, SEO, and accessibility.

# 1. Technology Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Three Fiber
- Drei
- Three.js
- GSAP
- GSAP ScrollTrigger
- Framer Motion only for small independent UI animations
- next/image
- GLB / GLTF optimized 3D assets

Optional:

- Lenis for smooth scrolling ONLY if correctly synchronized with ScrollTrigger.

## Animation Ownership

GSAP + ScrollTrigger must control all major scroll-linked animation.

React Three Fiber exposes 3D model transforms.

GSAP synchronizes:

- model position
- model rotation
- model scale
- camera/framing
- DOM opacity
- DOM position
- blur
- section transitions

Do NOT create competing animation systems for the same property.

# 2. Creative Direction

The portfolio should feel like a premium editorial developer portfolio,
NOT a 3D demo and NOT a dashboard.

Visual direction:

- Warm ivory / cream background
- Near-black typography
- Bronze/brown accent
- Large editorial typography
- Small uppercase letter-spaced labels
- Thin rules and micro-grid details
- Generous negative space
- Warm metallic / leather / glass 3D materials
- Minimal UI chrome

3D objects are storytelling elements rather than content containers.

Important information must remain HTML.

# 3. Design Tokens

Use CSS variables rather than repeatedly hard-coding values.

Suggested starting palette:

--canvas: #F1ECE4;
--surface: #F8F4EE;
--ink: #11100E;
--accent: #8B6A48;
--muted: #716B64;
--hairline: #D8D0C5;

These values may be tuned slightly to work with the final 3D lighting/HDRI,
but the overall warm ivory + bronze + near-black identity must remain.

# 4. Typography

Use one modern neutral sans-serif family such as:

- Geist
- Inter
- Helvetica Neue
- equivalent neo-grotesk font

Do not mix unnecessary font families.

Desktop display headings:
72px–128px

Section headings:
Use fluid clamp() sizing.

Body:
16px–20px
line-height: 1.45–1.65

Micro labels:
11px–13px
uppercase
letter-spacing: 0.20em–0.35em

Buttons:
14px–16px
medium weight
pill geometry

Use CSS clamp() for important responsive typography.

# 5. Layout System

Desktop content width:
approximately 1440–1600px.

Horizontal padding:
approximately 4–6vw.

Use a 12-column editorial grid.

Major sections should generally occupy at least:

100svh

Use 100svh instead of 100vh where appropriate for mobile browser behavior.

Recurring visual elements:

- section index
- thin horizontal rules
- small circular markers
- micro labels
- restrained pill controls

Avoid excessive cards and dashboard-like layouts.

# 6. Suggested Project Architecture

src/
├── app/
│ ├── layout.tsx
│ ├── page.tsx
│ └── globals.css
│
├── components/
│ ├── layout/
│ │ ├── Navbar.tsx
│ │ ├── SectionLabel.tsx
│ │ └── ScrollCue.tsx
│ │
│ ├── sections/
│ │ ├── HeroSection.tsx
│ │ ├── AboutSection.tsx
│ │ ├── SkillsSection.tsx
│ │ ├── ProjectsSection.tsx
│ │ ├── ExperienceSection.tsx
│ │ └── ContactSection.tsx
│ │
│ ├── three/
│ │ ├── SceneCanvas.tsx
│ │ ├── HeadphoneModel.tsx
│ │ ├── ProjectStack.tsx
│ │ ├── HourglassModel.tsx
│ │ ├── EnvelopeModel.tsx
│ │ └── Environment.tsx
│ │
│ └── ui/
│ ├── PillButton.tsx
│ ├── TechTag.tsx
│ ├── SocialLinks.tsx
│ └── MagneticButton.tsx
│
├── data/
│ ├── projects.ts
│ ├── experience.ts
│ └── skills.ts
│
├── hooks/
│ ├── useReducedMotion.ts
│ └── useResponsive3D.ts
│
└── lib/
├── gsap.ts
└── constants.ts

public/
├── models/
├── textures/
├── projects/
├── logos/
└── icons/

# 7. CRITICAL GLOBAL SCROLL RULE

THIS RULE MUST NOT BE CHANGED OR SIMPLIFIED.

Scroll position is the master timeline for every major scroll-driven
transition.

Major transitions must NOT merely trigger because an element enters
the viewport.

Use scrubbed GSAP ScrollTrigger timelines.

Required behavior:

User scrolls downward
→ animation progresses forward.

User stops scrolling
→ animation freezes EXACTLY at the current progress.

User continues scrolling
→ animation continues from that exact state.

User scrolls upward
→ the SAME timeline reverses naturally.

This applies to:

- 3D rotation
- 3D position
- scale / zoom
- camera framing
- DOM opacity
- blur
- section transitions
- project transitions
- hourglass transitions

DO NOT auto-complete an animation after scrolling stops.

DO NOT create separate reverse animations.

DO NOT use play-on-enter behavior for primary cinematic transitions.

Pinned sections must remain synchronized with scroll progress.

# 8. Ambient Animation Rule

Ambient animation is allowed for:

- Headphone idle motion
- Skills marquees
- Contact envelope motion

Ambient animations are NOT scroll-controlled.

However:

Never allow idle animation and ScrollTrigger to write to the same
transform property simultaneously.

Recommended R3F structure:

ScrollTransformGroup
└── IdleAnimationGroup
└── Model

Outer group:
controlled by ScrollTrigger.

Inner group:
controlled by subtle idle animation.

Suspend or minimize idle movement while a major scroll transition
is active.

# 9. SECTION 01 — HERO

## Layout

100svh hero with light/fixed/absolute navigation.

Left area:

- Name
- Developer role statement
- Primary CTA
- Secondary intro action
- Small vertical section marker

Center/right:

- Large 3D headphone
- Code/binary trails
- Small developer-related floating elements

The headphone is the dominant visual object.

Binary/code ribbons should be separate geometry, particles, SVG,
or DOM layers rather than part of one huge GLB.

## Initial Entrance

On first load:

1. Reveal typography.
2. Reveal headphone.
3. Reveal micro-elements.

Total intro should remain roughly under 1.2 seconds.

## Headphone Idle Motion

When the Hero is settled:

- subtle Y-axis float
- roughly 1–2° rotation
- slight orbit drift

It should feel alive rather than spinning like a product showcase.

# 10. HERO → ABOUT TRANSITION

This is one of the most important animations in the portfolio.

When scrolling starts:

1. ScrollTrigger takes control of the headphone.
2. Headphone rotates clockwise.
3. Headphone simultaneously moves/zooms toward the camera.
4. Movement originates from the right-side Hero composition.
5. Camera/model framing progressively targets one speaker cup.
6. Hero text/UI gradually fades PARTIALLY.
7. Speaker cup eventually fills the viewport.

At maximum zoom:

The viewport should become visually black because the camera is
extremely close to the speaker cup.

This is NOT a timed black screen.

The black state exists as part of scroll progress.

If scrolling stops here:
everything remains frozen.

Continuing downward:

1. Headphone continues moving in the SAME clockwise direction.
2. Headphone zooms back out.
3. Headphone moves toward its About composition.
4. About content fades/reveals simultaneously.
5. Headphone settles into a slightly tilted pose.

After transition completion:

- headphone remains positioned in About
- subtle automatic idle movement resumes

# 11. HERO ← ABOUT REVERSE TRANSITION

Scrolling upward MUST reverse the exact same sequence.

About content fades away.

Headphone moves toward speaker-cup close-up.

Black transition returns.

Headphone zooms away from the camera.

Headphone returns to Hero composition.

Hero content returns.

There must be:

- no jumps
- no reset
- no second reverse timeline
- no forced completion

# 12. SECTION 02 — ABOUT

Use a split editorial composition.

Left:
large statement / introduction.

Center:
reused headphone model.

Right:
biography, developer traits, and information.

Metrics must be HTML.

Possible metrics:

- projects
- years
- curiosity

Do NOT render metrics as 3D text.

The headphone should use:

- different framing from Hero
- slightly tilted resting position
- reduced visual intensity

The Hero headphone asset should be reused rather than downloaded again.

The section may include a restrained lower image strip.

About should remain readable and editorial rather than becoming
another cinematic 3D showcase.

# 13. ABOUT → SKILLS

The headphone DOES NOT continue into Skills.

As About exits:

- finish headphone transition
- fade/unmount the headphone scene when appropriate
- introduce Skills cleanly

Skills intentionally creates visual breathing room after Hero/About.

# 14. SECTION 03 — SKILLS

NO primary 3D object.

Use a Logo Cloud Marquee system.

Header:

"TOOLS THAT
POWER MY IDEAS."

Use two marquee rows.

Row 1:
Frontend technologies
→ moves left.

Row 2:
Backend / tools / others
→ moves right.

Each item contains:

[technology logo] [technology name]

Examples:

React
Next.js
TypeScript
Tailwind CSS
JavaScript
Redux
Framer Motion
MongoDB
Firebase
Node.js
Express
Git
GitHub
Docker
Figma
VS Code

Use real brand-colored logos.

Surrounding UI remains neutral.

Requirements:

- seamless infinite looping
- duplicate arrays to avoid visible reset
- consistent item height
- thin separators
- slow/pause on hover
- keyboard focus support

Reduced motion:

Replace animated marquees with a static wrapping grid.

# 15. SECTION 04 — PROJECTS

Projects is a PINNED storytelling section.

Composition:

LEFT:
stable editorial heading and supporting copy.

Example direction:

"Ideas
Into
Reality."

CENTER:
layered project/browser planes.

RIGHT:
ONLY active project's details.

Details include:

- project number
- title
- category
- description
- technologies
- View Project CTA

Do NOT bake project text into WebGL textures.

Project information must remain DOM/HTML.

# 16. PROJECT SCROLL BEHAVIOR

When Projects reaches its activation point:

PIN the composition.

Each project consumes a defined scroll segment.

For each transition:

Current project:

- moves slightly backward in Z-space
- fades
- receives small controlled tilt/rotation

Current details:

- fade out synchronously

Next project:

- moves toward camera
- becomes primary panel
- settles into tilted active position

Next details:

- fade in synchronously

If the user stops halfway:

FREEZE EVERYTHING AT THAT EXACT STATE.

Scrolling downward continues.

Scrolling upward reverses the same transformation.

Repeat for every project.

After final project:

- maintain a short reading range
- unpin
- continue naturally to Experience

Preload the next project texture before activation.

# 17. SECTION 05 — EXPERIENCE

Use a 3D hourglass as the central storytelling metaphor.

Composition:

LEFT:
"MY JOURNEY SO FAR."

Keep mostly static.

CENTER:
3D hourglass.

RIGHT:
one active experience entry at a time.

Do NOT place role text inside the hourglass model.

# 18. EXPERIENCE SCROLL SEQUENCE

When Experience reaches its activation point:

1. Fade section in.
2. Pin section.
3. Show Experience 01.
4. Hourglass starts at rotation 0°.

For every next experience:

Current role:

- fades out
- slides slightly right
- may receive subtle blur

Hourglass:

- rotates approximately 180°

Next role:

- fades/slides in near the end of rotation

Rotation progression:

Experience 01 → 0°
Experience 02 → 180°
Experience 03 → 360°
Experience 04 → 540°
etc.

Each experience consumes one normalized scroll segment.

At the midpoint of a flip:

The hourglass may slightly reduce visibility/lighting.

Do NOT make it hard blink.

If scrolling stops at 87°:

The hourglass stays at 87°.

The corresponding text opacity also remains at that exact
timeline state.

Scrolling upward reverses everything.

After final experience:

- keep final role readable briefly
- release pin
- transition to Contact

# 19. EXPERIENCE MOBILE FALLBACK

For smaller devices or reduced-motion environments:

Prefer:

- normal vertical timeline
- static or lightly animated hourglass
- no aggressive pinning

Only retain pinned behavior on mobile if UX remains natural.

# 20. SECTION 06 — CONTACT

Contact intentionally reduces interaction intensity.

Layout:

LEFT:
large closing statement.

Example direction:

"LET'S
BUILD
SOMETHING
GREAT."

CENTER:
3D envelope / letter.

RIGHT:
contact form and contact/social information.

Form fields:

- Name
- Email
- Subject
- Message
- Submit

Use accessible labels even when placeholders are visible.

Contact should NOT use project-style pagination.

# 21. CONTACT ANIMATION

Contact does NOT use a scroll-scrubbed 3D sequence.

On entrance:

- heading reveals
- form reveals
- supporting information reveals
- use soft staggered animation

Envelope:

- gentle idle float
- subtle idle rotation/orbit

Envelope animation must NOT depend directly on scroll position.

Optional successful submission feedback:

- subtle seal movement
- open animation
- slight tilt

Keep it restrained.

# 22. RESPONSIVE STRATEGY

## Desktop — >= 1200px

Use:

- full editorial compositions
- full 3D scenes
- large typography
- intended pinned sequences

## Tablet — 768px–1199px

Reduce:

- model scale
- decorative geometry
- orbit elements
- unnecessary micro-copy
- pinned scroll distances

Maintain the same storytelling concept.

## Mobile — < 768px

Stack content vertically.

Reduce:

- model polygon complexity where possible
- Canvas DPR
- shadows
- decorative particles
- unnecessary 3D effects

Keep only one strong 3D focal object per relevant section.

Projects and Experience may use:

- shortened pinning
- scroll snap
- normal stacked layout

Choose whichever produces the most reliable mobile UX.

Navigation becomes compact.

Primary CTAs must remain accessible.

Use 100svh.

# 23. 3D ASSET PIPELINE

For Blender / BlenderKit assets:

1. Select assets matching the warm premium material language.
2. Remove hidden geometry.
3. Remove unnecessary modifiers.
4. Apply transforms.
5. Correct object origins.
6. Correct rotation pivots.
7. Reduce texture resolution.
8. Prefer 1K–2K textures.
9. Compress models.
10. Export optimized GLB/GLTF.
11. Use Draco/Meshopt where appropriate.
12. Test on mid-range hardware.

Lighting:

Prefer:

- environment lighting
- baked detail
- very few real-time lights

Avoid unnecessary shadow-casting lights.

# 24. MODEL-SPECIFIC RULES

## Headphones

Preserve:

- leather roughness
- warm metallic highlights

Reuse one model across Hero and About.

## Projects

Project stack may use procedural R3F planes rather than a Blender model.

This is preferred when it simplifies screenshot replacement.

## Hourglass

Pivot MUST be at geometric center.

Test glass transparency carefully.

Rotation must remain visually centered.

## Envelope

Keep geometry relatively simple.

Seal and letter may be separate meshes for submit-success animation.

# 25. PERFORMANCE REQUIREMENTS

Target:

Desktop:
smooth ~60fps.

Mobile:
stable 30–60fps.

Do NOT keep multiple heavy WebGL canvases running unnecessarily.

Prefer:

- shared Canvas architecture
  OR
- mount scenes only near active sections

Use dynamic imports for 3D-heavy components.

Cap DPR.

Suggested:

Mobile:
1–1.5

Desktop:
up to approximately 2 when useful.

Pause/reduce rendering when scenes are off-screen.

Compress:

- GLBs
- textures
- project images

Avoid 4K textures unless genuinely necessary.

Lazy-load section-specific models.

Do NOT block initial HTML rendering while waiting for GLB assets.

Provide a static fallback if WebGL fails.

# 26. ACCESSIBILITY

All meaningful information must exist in semantic HTML.

3D is enhancement only.

Required:

- keyboard navigation
- visible focus states
- accessible form labels
- alt text
- accessible icon button names
- sufficient contrast
- prefers-reduced-motion support

Reduced-motion mode must disable or simplify:

- scrubbed 3D transitions
- aggressive parallax
- hourglass flipping
- moving marquees

Never make essential information dependent on animation.

Avoid aggressive scroll-jacking.

# 27. DATA ARCHITECTURE

Portfolio content should live outside animation components.

Do NOT hard-code project/experience/skill content inside complex
GSAP or R3F components.

Example:

type Project = {
id: string;
title: string;
category: string;
description: string;
image: string;
tech: string[];
liveUrl?: string;
repoUrl?: string;
};

type Experience = {
id: string;
period: string;
role: string;
company: string;
description: string;
achievements?: string[];
tech?: string[];
};

type Skill = {
name: string;
category: "frontend" | "backend" | "tools";
logo: string;
};

# 28. DEVELOPMENT ORDER

DO NOT start by building the final 3D choreography.

Follow this order.

## Phase 1 — Foundation

Build:

- Next.js structure
- TypeScript
- Tailwind
- fonts
- CSS variables
- grid
- navbar
- reusable primitives

## Phase 2 — Static 2D Build

Build ALL six sections without complex 3D animation.

Finish:

- desktop composition
- responsive layout
- typography
- spacing
- hierarchy

before complex 3D work.

## Phase 3 — Skills

Implement:

- logo data
- two marquees
- responsive behavior
- reduced-motion fallback

## Phase 4 — Hero/About 3D

Implement:

- headphone loading
- optimization
- camera
- lighting
- responsive framing
- idle movement

Then implement Hero → About scroll choreography.

## Phase 5 — Projects

Implement:

- project data
- project planes
- pinned ScrollTrigger
- active project transitions
- DOM/3D synchronization

## Phase 6 — Experience

Implement:

- hourglass
- correct pivot
- pinned timeline
- experience synchronization
- 180° flips

## Phase 7 — Contact

Implement:

- envelope
- form
- validation
- API/backend
- success/error states
- social/contact links

## Phase 8 — Polish

Implement:

- section transitions
- micro interactions
- navigation active state
- hover/focus
- final easing

## Phase 9 — Optimization

Perform:

- GLB compression
- texture optimization
- lazy loading
- DPR tuning
- mobile fallback
- Lighthouse testing

## Phase 10 — QA & Deployment

Test:

- browsers
- screen sizes
- touch
- mouse wheel
- trackpad
- keyboard
- accessibility
- SEO
- production build

# 29. QA CHECKLIST

Before considering implementation complete, verify:

[ ] Warm editorial visual identity is consistent.

[ ] Hero remains the strongest opening composition.

[ ] Skills provides intentional visual breathing room.

[ ] Hero → About headphone transition is fully scroll-scrubbed.

[ ] Speaker-cup black transition is controlled by scroll progress.

[ ] Stopping scroll freezes Hero/About transition.

[ ] Reverse scroll correctly restores Hero.

[ ] Projects pin correctly.

[ ] Projects transition correctly in both directions.

[ ] Stopping between projects freezes the intermediate state.

[ ] Experience pins correctly.

[ ] Hourglass rotates approximately 180° per role.

[ ] Stopping mid-flip freezes hourglass and text state.

[ ] Experience reverses correctly.

[ ] Contact remains calm and does not use unnecessary scroll choreography.

[ ] Fast wheel scrolling does not break state.

[ ] Trackpad scrolling does not break state.

[ ] Mobile framing works.

[ ] Ultrawide framing works.

[ ] No hydration errors.

[ ] ScrollTriggers are cleaned up correctly.

[ ] prefers-reduced-motion works.

[ ] Keyboard navigation works.

[ ] Contact validation works.

[ ] External links use safe target/rel behavior.

[ ] Production Lighthouse testing completed.

# 30. AGENT CODING RULES

When implementing a requested section:

1. Inspect existing related components first.
2. Reuse existing abstractions where appropriate.
3. Do not rewrite unrelated working code.
4. Keep components focused.
5. Keep content separate from animation logic.
6. Avoid giant components.
7. Keep GSAP setup/cleanup safe.
8. Use gsap.context() where appropriate.
9. Clean up ScrollTriggers on unmount.
10. Avoid creating duplicate ScrollTriggers.
11. Avoid unnecessary React re-renders during animation.
12. Prefer refs for frequently animated Three.js objects.
13. Do not update React state every animation frame.
14. Keep WebGL transforms outside React state when possible.
15. Preserve responsive behavior.
16. Preserve accessibility.
17. Preserve reduced-motion behavior.
18. Test reverse scrolling.
19. Test fast scrolling.
20. Do not introduce new dependencies without a clear need.

# 31. IMPORTANT IMPLEMENTATION CONSTRAINTS

Never:

- Replace the design with a generic portfolio template.
- Turn the interface into a card-heavy dashboard.
- Put essential text inside WebGL.
- Trigger primary animations only on viewport entry.
- Auto-complete scroll animations after scrolling stops.
- Create separate forward/reverse animation systems.
- Run competing animations against the same transform.
- Load every heavy 3D asset immediately.
- Sacrifice accessibility for visual effects.
- Sacrifice mobile usability to preserve desktop animation.
- Modify completed sections unnecessarily.

# 32. SOURCE OF TRUTH PRIORITY

If implementation decisions conflict, follow this priority:

1. Explicit latest user instruction
2. This AGENTS.md specification
3. Selected section visual references
4. Existing working project architecture
5. General implementation assumptions

Never silently change a major interaction because another implementation
would be easier.

# 33. FINAL MOTION RHYTHM

The complete experience should feel like:

HERO
Cinematic 3D introduction
↓
HEADPHONE ZOOM
Speaker cup fills viewport
↓
BLACK TRANSITION
Scroll-controlled
↓
ABOUT
Headphone story continues
↓
SKILLS
Calm 2D logo marquee
↓
PROJECTS
Pinned interactive project storytelling
↓
EXPERIENCE
Pinned hourglass storytelling
↓
CONTACT
Calm ambient 3D ending

The portfolio should alternate between high-motion storytelling and
quiet readable sections instead of maintaining maximum visual intensity
everywhere.

# 34. FINAL AGENT INSTRUCTION

Before writing code for any task:

READ THIS FILE.

Then determine:

- Which section is affected?
- Is the behavior scroll-driven or ambient?
- Does the animation need to reverse?
- Does it need to freeze when scrolling stops?
- Does it affect a 3D transform?
- Does it conflict with an idle animation?
- What is the mobile behavior?
- What is the reduced-motion behavior?
- Can existing components be reused?

Implement the smallest clean change that satisfies the specification.

For scroll-driven interactions, always remember:

SCROLL POSITION = ANIMATION STATE.

Not:

SCROLL EVENT = START ANIMATION.

<!-- END:nextjs-agent-rules -->
