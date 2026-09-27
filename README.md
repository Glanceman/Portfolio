# Portfolio

[link](https://benportfolio123.netlify.app/)

A Vue 3 + Tailwind v4 portfolio with a **Persona 5 inspired design language** —
the comic-book shear, the three-ink palette and the restless hover motion —
recoloured in acid chartreuse rather than Persona 5's red, so the style is
referenced rather than copied.

---

## The design system

Everything lives in `src/assets/main.css`, in the order below. Read that file
first — it is the source of truth for the whole look.

### 1. Three inks and one loud colour

Persona 5's designers refused sub-colours: pure black, pure white, one
saturated accent used sparingly so that whatever it touches *pops*. That
discipline is kept exactly; only the accent changed.

| Token | Value | Role |
| --- | --- | --- |
| `--color-ink` | `#000000` | ground |
| `--color-ink-2` / `--color-ink-3` | `#0b0b0b` / `#171717` | panel steps |
| `--color-paper` | `#f4f2ec` | text + rules |
| `--color-paper-2` | `#cfccc1` | secondary text, hairlines |
| `--color-mute` | `#8a877d` | stamps, metadata |
| `--color-accent` | `#d9f520` | **the** loud colour — acid chartreuse |
| `--color-data` | `#35e7ff` | stats/code only (P5 used magenta + turquoise here) |
| `--color-alert` | `#ff2f5e` | live/current only |

To re-skin the whole site, change `--color-accent` and `--color-data` in
`@theme`. Nothing else should need touching.

### 2. The shear

Every block is skewed — `skewX(-10deg)` is the house angle, `-16deg` for the
big background slabs. `.slant`, `.slant-lg`, `.slant-rev` shear a container;
`.unslant` brings its contents back to square.

> **Gotcha worth knowing:** a running CSS animation overrides `transform`, so a
> naive `@keyframes` would make a skewed block snap upright for one frame and
> then lean again. Every shear utility therefore also publishes a `--sk` custom
> property, and the motion keyframes re-apply it with
> `skewX(calc(var(--sk, 0deg) + 1.6deg))`. Add a new keyframe that animates
> `transform` and you must do the same or you will reintroduce the pop.

### 3. Hover loops — the signature

P5's UI is never still. These are the reusable parts, and the animations only
run while the element is hovered:

| Class | On hover |
| --- | --- |
| `.p5-btn` | accent wedge slams in → then infinite jitter + marching hatch |
| `.p5-nav-item` | same wipe, plus the label itself keeps leaning |
| `.p5-tag` | fill wipes in, chip micro-jitters |
| `.p5-card` | accent wedge sweeps across on a loop, halftone breathes, title jitters, card shifts up-left |
| `.skill` (IconCard) | flips paper → accent, spins a corner burst |

### 4. Rhythm: fast UI, slow background

This is the detail that makes P5 feel urgent. Interface loops run at
**0.5–0.7s**; the background (`BackdropFX.vue`) runs at **19–44s**. Same
vocabulary, an order of magnitude apart, and the contrast is what sells it.

### 5. Print furniture

`.halftone` (Ben-Day dots), `.hatch` / `.hatch-fat` (diagonal comic shading),
`.burst` (a 24-point jagged star), `.grain` (SVG `feTurbulence` newsprint
noise), `.p5-rule` (hatched divider).

---

## Type

Self-hosted in `src/assets/fonts` — no third-party font CDN, so the design
cannot half-load on a cold cache or a blocked network.

| Face | Use | Source |
| --- | --- | --- |
| **Anton** | `display` — cut-out headlines, menu type | `@fontsource/anton` |
| **Archivo** | `font-body` — all copy | `@fontsource/archivo` |
| **Space Mono** | `stamp` — the small technical labels | `@fontsource/space-mono` |

`.display` and `.stamp` are the two type utilities the design system is built
on. To update a face, replace the `.woff2` in `src/assets/fonts/` and the
matching `@font-face` block in `main.css`.

---

## Components

```
src/components/
├── BackdropFX.vue          slow drifting halftone / hatch / sheared slabs
├── Header.vue              command menu: left rail on lg+, off-canvas below
├── P5Cursor.vue            sheared cursor that snaps open over anything clickable
├── Scene.vue               Three.js 3D model (About page)
└── Reusable/
    ├── P5Button.vue        the button
    ├── P5Tag.vue           sheared chip
    ├── SectionTitle.vue    sheared bar + stamped index + display title
    ├── BurstBadge.vue      spinning comic "POW" badge
    ├── IconCard.vue        skill tile
    └── TimelineList.vue    education / work spine
```

### Trap: never put `mode="out-in"` on the RouterView `<Transition>`

`src/App.vue` uses the default simultaneous mode on purpose. Adding
`mode="out-in"` breaks every **lazy-loaded** route — home keeps working, and
every other tab renders nothing at all.

vue-router hands the `<RouterView>` slot a **pre-created VNode**, not a
component definition. `Transition` in `out-in` mode renders a placeholder while
the old child leaves and swaps the new one in on the next tick, which leaves it
holding an `undefined` child:

```
WARN Invalid vnode type when creating vnode: undefined.
```

The default mode is correct for a VNode child, and an overlapping cut is the
more P5 transition anyway.

---

## Accessibility & motion

- `prefers-reduced-motion: reduce` strips every loop; the colour and shape
  language survives.
- The custom cursor only mounts for `(pointer: fine)`, and `cursor: none` is
  applied from JS *after* mount — if scripting fails you still get a real
  cursor. An I-beam is kept over selectable blog prose.
- The off-canvas mobile panel gets `inert` while closed, so its links leave the
  tab order.
- Focus rings are a 3px accent outline at a 3px offset — visible on both inks.

## Known issue

`npm run lint` is broken on `main`: the project has an `.eslintrc.cjs` but
ESLint 9 expects a flat `eslint.config.js`. The script also passes
`--ignore-path`, which no longer exists. Unrelated to the redesign — it needs a
one-off migration to `eslint.config.js`.

---

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
