<script setup>
import Typed from 'typed.js'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import projects from '@/assets/projects.json'
import { getUrl } from '@/assets/tools.js'
import P5Button from '@/components/Reusable/P5Button.vue'
import P5Tag from '@/components/Reusable/P5Tag.vue'
import BurstBadge from '@/components/Reusable/BurstBadge.vue'
import SectionTitle from '@/components/Reusable/SectionTitle.vue'

const typing = ref(null)
let typed = null

const featured = projects.filter((p) => p.image).slice(0, 3)

const stats = [
  { k: 'Projects', v: String(projects.length).padStart(2, '0') },
  { k: 'Discipline', v: 'CS / Media' },
  { k: 'Based in', v: 'Hong Kong' }
]

const ticker = [
  'Vue 3',
  'C++',
  'Python',
  'Unreal 5',
  'PyTorch',
  'Three.js',
  'Tailwind',
  'OpenGL',
  'Figma',
  'Node.js'
]

onMounted(() => {
  if (!typing.value) return
  typed = new Typed(typing.value, {
    strings: ['Ben.', 'a Developer.', 'a Software Engineer.', 'a Creative Coder.'],
    typeSpeed: 65,
    backSpeed: 35,
    backDelay: 1400,
    loop: true
  })
})
onBeforeUnmount(() => typed?.destroy())
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- ================= backdrop ================= -->
    <div class="absolute inset-0 isolate overflow-hidden" aria-hidden="true">
      <video
        class="absolute inset-0 h-full w-full object-cover opacity-60 [filter:grayscale(1)_contrast(1.35)_brightness(0.75)]"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
      >
        <source :src="getUrl('/FYP Fast Track Video.mp4')" type="video/mp4" />
      </video>

      <!-- duotone the footage into the accent ink -->
      <div class="absolute inset-0 bg-accent opacity-80 mix-blend-color"></div>
      <div class="halftone absolute inset-0 text-ink opacity-[0.18]"></div>
      <div class="absolute inset-0 bg-ink/45"></div>
      <div
        class="absolute inset-0"
        style="
          background:
            linear-gradient(105deg, rgba(0, 0, 0, 0.96) 8%, rgba(0, 0, 0, 0.6) 46%, rgba(0, 0, 0, 0.2) 100%),
            linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, transparent 45%);
        "
      ></div>
    </div>

    <!-- ================= hero ================= -->
    <div
      class="relative mx-auto flex min-h-screen max-w-[85rem] flex-col justify-center px-5 py-24 sm:px-8 lg:px-14"
    >
      <!-- burst + kicker -->
      <div class="mb-7 flex flex-wrap items-center gap-4 p5-rise">
        <BurstBadge text="Open to work" class="h-20 w-20 sm:h-24 sm:w-24" />
        <p class="stamp max-w-[16rem] leading-relaxed text-paper/70">
          Creative-media graduate turned software engineer — I build the
          interface, the engine behind it, and the shader in between.
        </p>
      </div>

      <!-- the name, cut out in P5 display type -->
      <h1 class="display p5-rise text-[clamp(3.6rem,15vw,11rem)] text-paper" style="animation-delay: 80ms">
        Ben<span class="text-accent">.</span>
      </h1>

      <p
        class="display mt-2 p5-rise text-[clamp(1.15rem,4.4vw,2.9rem)] text-paper/80"
        style="animation-delay: 140ms"
      >
        I&nbsp;am&nbsp;<span ref="typing" class="text-accent"></span>
      </p>

      <div
        class="mt-9 flex flex-wrap items-center gap-4 p5-rise"
        style="animation-delay: 200ms"
      >
        <P5Button to="/project" variant="solid">Take a look</P5Button>
        <P5Button to="/about" variant="outline">Who is Ben?</P5Button>
        <P5Button to="/blog" variant="ghost" size="sm">Read the notes</P5Button>
      </div>

      <!-- stat strip -->
      <dl
        class="mt-14 grid max-w-3xl grid-cols-1 gap-px p5-rise sm:grid-cols-3 sm:gap-0"
        style="animation-delay: 280ms"
      >
        <div
          v-for="s in stats"
          :key="s.k"
          class="group slant border-2 border-paper bg-ink/80 px-5 py-3 transition-colors duration-150 hover:border-accent sm:-mr-2 sm:last:mr-0"
        >
          <div class="unslant">
            <dt class="stamp text-mute">{{ s.k }}</dt>
            <dd class="display text-2xl text-paper group-hover:text-accent">{{ s.v }}</dd>
          </div>
        </div>
      </dl>
    </div>

    <!-- ================= ticker ================= -->
    <div class="p5-marquee relative z-10 border-y-2 border-paper bg-ink py-2.5">
      <div class="p5-marquee-track">
        <div v-for="n in 2" :key="n" class="flex shrink-0 items-center">
          <template v-for="t in ticker" :key="t + n">
            <span class="stamp px-5 text-paper/60">{{ t }}</span>
            <span class="text-accent" aria-hidden="true">◆</span>
          </template>
        </div>
      </div>
    </div>

    <!-- scroll cue -->
    <a
      href="#more"
      class="group absolute bottom-5 left-5 z-10 sm:left-8 lg:left-14"
      data-p5-hot
    >
      <span class="stamp flex flex-col items-start gap-1.5 text-mute transition-colors group-hover:text-accent">
        Scroll
        <span class="p5-scroll-cue block text-accent" aria-hidden="true">▼</span>
      </span>
    </a>
  </div>

  <!-- ================= below the fold ================= -->
  <section id="more" class="relative border-t-2 border-paper bg-ink/40">
    <div class="mx-auto max-w-[85rem] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
      <SectionTitle index="01" kicker="Objective" title="Right now" tone="accent" />

      <div class="mt-12 grid gap-8 lg:grid-cols-[1fr_1.25fr]">
        <!-- NOW card -->
        <article
          class="group relative overflow-hidden border-[3px] border-paper bg-ink-2 p-7 transition-colors duration-200 hover:border-accent sm:p-9"
        >
          <div
            class="pointer-events-none absolute inset-0 halftone text-accent opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.16]"
            aria-hidden="true"
          ></div>
          <div
            class="pointer-events-none absolute -top-10 -right-10 h-40 w-40 bg-accent opacity-10 animate-[p5-spin_18s_linear_infinite]"
            style="clip-path: polygon(50% 0%, 61% 22%, 82% 6%, 78% 30%, 100% 34%, 84% 52%, 96% 74%, 70% 68%, 62% 100%, 46% 76%, 24% 96%, 24% 66%, 0% 62%, 18% 42%, 4% 18%, 32% 26%)"
            aria-hidden="true"
          ></div>

          <div class="relative">
            <p class="stamp flex items-center gap-2 text-accent">
              <span class="inline-block h-2 w-2 bg-alert animate-[p5-blink_1.4s_steps(1,end)_infinite]"></span>
              Live status
            </p>
            <h3 class="display mt-4 text-4xl text-paper sm:text-5xl">
              Deep in<br />engine &amp;<br />graphics work
            </h3>
            <p class="mt-5 max-w-sm leading-relaxed text-paper/70">
              Currently moving between real-time rendering, computer vision and
              front-end systems. If you want something built that is fast,
              legible and a little bit loud — get in touch.
            </p>
            <div class="mt-7 flex flex-wrap gap-2">
              <P5Tag v-for="t in ['Three.js', 'C++', 'PyTorch', 'Vue 3']" :key="t">{{ t }}</P5Tag>
            </div>
            <P5Button
              href="mailto:benxian456@gmail.com"
              variant="ghost"
              size="sm"
              class="mt-8"
            >
              Say hello
            </P5Button>
          </div>
        </article>

        <!-- featured work -->
        <div>
          <div class="mb-6 flex items-baseline justify-between gap-4">
            <h3 class="display text-3xl text-paper">Selected work</h3>
            <P5Button to="/project" variant="ghost" size="sm">All {{ projects.length }}</P5Button>
          </div>

          <ul class="space-y-4">
            <li v-for="p in featured" :key="p.name">
              <a
                :href="p.link"
                target="_blank"
                rel="noopener noreferrer"
                class="p5-card group flex items-center gap-5 p-4"
                data-p5-hot
              >
                <span class="p5-card__media relative block h-20 w-28 shrink-0 overflow-hidden border-2 border-paper sm:h-24 sm:w-36">
                  <img
                    v-if="p.image"
                    :src="getUrl(p.image)"
                    :alt="p.name"
                    class="h-full w-full object-cover [filter:grayscale(1)_contrast(1.2)] transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <span v-else class="grid h-full w-full place-items-center halftone text-accent">—</span>
                </span>

                <span class="p5-card__body min-w-0 flex-1">
                  <span class="p5-card__title display block text-xl text-paper sm:text-2xl">
                    {{ p.name }}
                  </span>
                  <span class="mt-1 block truncate text-sm text-paper/60">{{ p.description }}</span>
                  <span class="mt-2 flex flex-wrap gap-1.5">
                    <P5Tag v-for="t in p.tag.slice(0, 4)" :key="t" tone="data">{{ t }}</P5Tag>
                  </span>
                </span>

                <span class="shrink-0 text-accent" aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
