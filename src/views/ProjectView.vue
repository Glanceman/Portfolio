<script setup>
import projects from '@/assets/projects.json'
import { getUrl } from '@/assets/tools.js'
import SectionTitle from '@/components/Reusable/SectionTitle.vue'
import P5Tag from '@/components/Reusable/P5Tag.vue'
import BurstBadge from '@/components/Reusable/BurstBadge.vue'
</script>

<template>
  <div>
    <!-- ===================== masthead ===================== -->
    <header class="relative overflow-hidden border-b-2 border-paper">
      <div class="halftone absolute inset-0 text-paper opacity-[0.06]" aria-hidden="true"></div>
      <div
        class="slant-lg absolute -top-24 right-[10%] h-80 w-28 bg-accent opacity-[0.14] animate-[p5-drift-b_26s_ease-in-out_infinite]"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto max-w-[85rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
        <p class="stamp mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-accent">
          <span>// 03</span><span>Heists</span>
        </p>
        <div class="flex flex-wrap items-end justify-between gap-8">
          <h1 class="display text-[clamp(3rem,12vw,8.5rem)] text-paper">
            Projects<span class="text-accent">.</span>
          </h1>
          <div class="pb-3">
            <BurstBadge
              :text="`${projects.length} targets`"
              tone="ink"
              class="h-20 w-20 sm:h-24 sm:w-24"
            />
          </div>
        </div>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
          Games, tools, models and half-finished experiments. Each one is a
          target: something I went after, built, and learned something from.
        </p>
      </div>
    </header>

    <!-- ===================== the grid ===================== -->
    <section class="mx-auto max-w-[85rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <SectionTitle index="01" kicker="The haul" title="Everything shipped" />

      <ul class="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="(p, i) in projects"
          :key="p.name"
          class="p5-rise"
          :style="{ animationDelay: 60 + i * 55 + 'ms' }"
        >
          <a
            :href="p.link"
            target="_blank"
            rel="noopener noreferrer"
            class="p5-card group flex h-full flex-col"
            :aria-label="`${p.name} — opens in a new tab`"
            data-p5-hot
          >
            <!-- media -->
            <span class="p5-card__media relative block aspect-[16/10] overflow-hidden border-b-[3px] border-paper">
              <img
                v-if="p.image"
                :src="getUrl(p.image)"
                :alt="p.name"
                class="h-full w-full object-cover [filter:grayscale(1)_contrast(1.15)] transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span
                v-else
                class="grid h-full w-full place-items-center halftone text-paper/30"
                aria-hidden="true"
              >
                <span class="display text-5xl">{{ String(i + 1).padStart(2, '0') }}</span>
              </span>

              <!-- target number -->
              <span
                class="stamp absolute top-0 left-0 z-10 bg-ink px-2.5 py-1.5 text-accent"
              >
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span
                class="stamp absolute right-0 bottom-0 z-10 bg-paper px-2.5 py-1.5 text-ink"
              >
                ↗ View
              </span>
            </span>

            <!-- body -->
            <span class="p5-card__body flex flex-1 flex-col p-6">
              <span class="p5-card__title display block text-[1.6rem] text-paper">
                {{ p.name }}
              </span>

              <span class="mt-2.5 flex-1 leading-relaxed text-paper/65">
                {{ p.description }}
              </span>

              <span class="mt-5 flex flex-wrap gap-1.5">
                <P5Tag v-for="t in p.tag" :key="t">{{ t }}</P5Tag>
              </span>
            </span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
