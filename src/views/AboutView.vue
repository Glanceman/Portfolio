<script setup>
import IconCard from '@/components/Reusable/IconCard.vue'
import SectionTitle from '@/components/Reusable/SectionTitle.vue'
import P5Button from '@/components/Reusable/P5Button.vue'
import TimelineList from '@/components/Reusable/TimelineList.vue'
import Scene from '@/components/Scene.vue'
import historyEvents from '@/assets/historyEvent.json'

const workHistory = historyEvents.filter((e) => e.type === 'Work')
const educationHistory = historyEvents.filter((e) => e.type === 'Education')

const loadout = [
  {
    kicker: 'Languages',
    tone: 'accent',
    items: [
      { ImagePath: '/image/C++.png', Word: 'C++' },
      { ImagePath: '/image/CSharp.png', Word: 'C#' },
      { ImagePath: '/image/Python.png', Word: 'Python' },
      { ImagePath: '/image/JS.png', Word: 'JavaScript' },
      { ImagePath: '/image/HTML5.png', Word: 'HTML5' },
      { ImagePath: '/image/CSS3.png', Word: 'CSS3' }
    ]
  },
  {
    kicker: 'Frameworks & tools',
    tone: 'data',
    items: [
      { ImagePath: '/image/UE5.png', Word: 'Unreal 5' },
      { ImagePath: '/image/Unity.png', Word: 'Unity' },
      { ImagePath: '/favicon.ico', Word: 'Vue 3' },
      { ImagePath: '/image/Pytorch.png', Word: 'PyTorch' },
      { ImagePath: '/image/Blender.png', Word: 'Blender' }
    ]
  }
]
</script>

<template>
  <div>
    <!-- ===================== masthead ===================== -->
    <header class="relative overflow-hidden border-b-2 border-paper">
      <div class="halftone absolute inset-0 text-paper opacity-[0.06]" aria-hidden="true"></div>
      <div
        class="slant-lg absolute -top-28 right-[8%] h-72 w-24 bg-accent opacity-[0.14] animate-[p5-drift-a_30s_ease-in-out_infinite]"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto max-w-[85rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
        <p class="stamp mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-accent">
          <span>// 02</span><span>Profile</span>
        </p>
        <h1 class="display text-[clamp(3rem,12vw,8.5rem)] text-paper">
          About<span class="text-accent">.</span>
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
          A creative media student turned programmer — interested in the part
          where graphics, systems design and interface craft all meet.
        </p>
      </div>
    </header>

    <!-- ===================== introduction ===================== -->
    <section class="mx-auto max-w-[85rem] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
      <SectionTitle index="01" kicker="Introduction" title="Who is Ben" />

      <div class="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div class="space-y-6 text-lg leading-relaxed text-paper/80">
          <p>
            Welcome to my portfolio. I am a creative media student with a passion
            for programming. Here you'll find work across C++, Python and C#,
            the web stack in HTML, CSS and JavaScript, plus real-time work in
            Unreal Engine and Unity.
          </p>
          <p>
            Most of what I build sits where the engine meets the interface —
            point-cloud networks, 3D pipelines, tools that make messy data
            legible. I care about the last 10% of polish, the kind where an
            interface stops being a layout and starts having a point of view.
          </p>
          <div class="flex flex-wrap gap-4 pt-2">
            <P5Button to="/project" variant="solid" size="sm">See the work</P5Button>
            <P5Button href="mailto:benxian456@gmail.com" variant="ghost" size="sm">
              Get in touch
            </P5Button>
          </div>
        </div>

        <!-- 3D model, framed like a comic panel -->
        <div class="relative">
          <div
            class="slant absolute -inset-3 border-[3px] border-accent opacity-50"
            aria-hidden="true"
          ></div>
          <div class="relative h-[22rem] overflow-hidden border-[3px] border-paper bg-ink-2 sm:h-[26rem]">
            <div class="halftone absolute inset-0 z-10 text-accent opacity-[0.1]" aria-hidden="true"></div>
            <Scene />
            <p class="stamp absolute bottom-3 left-3 z-20 text-mute">
              360° / thinking spinning
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== skills ===================== -->
    <section class="border-y-2 border-paper bg-ink/40">
      <div class="mx-auto max-w-[85rem] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
        <SectionTitle index="02" kicker="Loadout" title="Skills" tone="data" />

        <div class="mt-14 space-y-12">
          <div v-for="group in loadout" :key="group.kicker">
            <div class="mb-6 flex items-center gap-4">
              <span
                class="slant block h-6 w-2"
                :class="group.tone === 'data' ? 'bg-data' : 'bg-accent'"
                aria-hidden="true"
              ></span>
              <h3
                class="display text-2xl"
                :class="group.tone === 'data' ? 'text-data' : 'text-accent'"
              >
                {{ group.kicker }}
              </h3>
              <span
                class="stamp text-mute"
                :style="{
                  backgroundImage:
                    'repeating-linear-gradient(-45deg, currentColor 0 2px, transparent 2px 9px)',
                  height: '6px',
                  flex: 1
                }"
                aria-hidden="true"
              ></span>
            </div>

            <div class="flex flex-wrap gap-3 sm:gap-4">
              <IconCard
                v-for="s in group.items"
                :key="s.Word"
                :ImagePath="s.ImagePath"
                :Word="s.Word"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== history ===================== -->
    <section class="mx-auto max-w-[85rem] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
      <SectionTitle index="03" kicker="History" title="Timeline" />

      <div class="mt-14 space-y-16">
        <div>
          <h3 class="display mb-8 text-3xl text-paper">
            <span class="text-accent">//</span> Work
          </h3>
          <TimelineList :items="workHistory" />
        </div>
        <div>
          <h3 class="display mb-8 text-3xl text-paper">
            <span class="text-data">//</span> Education
          </h3>
          <TimelineList :items="educationHistory" tone="data" />
        </div>
      </div>
    </section>

    <!-- ===================== contact ===================== -->
    <footer class="relative overflow-hidden border-t-2 border-paper bg-ink">
      <div
        class="hatch-fat absolute inset-0 text-paper opacity-[0.05] -rotate-6"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto max-w-[85rem] px-5 py-20 sm:px-8 lg:px-14">
        <SectionTitle index="04" kicker="Contact" title="Say hello" />

        <div class="mt-12 grid gap-10 md:grid-cols-2">
          <a
            href="mailto:benxian456@gmail.com"
            class="group block border-b-2 border-paper/30 pb-4 transition-colors hover:border-accent"
            data-p5-hot
          >
            <p class="stamp text-mute">Email</p>
            <p class="display mt-1 text-2xl text-paper group-hover:text-accent sm:text-3xl">
              benxian456@gmail.com
            </p>
          </a>
          <a
            href="https://github.com/Glanceman"
            target="_blank"
            rel="noopener noreferrer"
            class="group block border-b-2 border-paper/30 pb-4 transition-colors hover:border-accent"
            data-p5-hot
          >
            <p class="stamp text-mute">GitHub</p>
            <p class="display mt-1 text-2xl text-paper group-hover:text-accent sm:text-3xl">
              github.com/Glanceman
            </p>
          </a>
        </div>

        <div class="mt-16 flex flex-col gap-4 border-t-2 border-paper/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p class="stamp text-mute">© Ben — all rights reserved</p>
          <p class="stamp text-mute">Vue 3 · Tailwind · Three inks</p>
        </div>
      </div>
    </footer>
  </div>
</template>
