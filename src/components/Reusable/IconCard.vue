<script setup>
import { getUrl } from '@/assets/tools.js'

/**
 * Skill tile. Paper block that flips to accent on hover, leans, and grows a
 * spinning comic burst in the corner — the label jitters the whole time.
 */
defineProps({
  ImagePath: { type: String, required: true },
  Word: { type: String, required: true }
})
</script>

<template>
  <div
    class="skill group relative isolate overflow-hidden border-2 border-paper bg-paper px-3.5 py-2.5 text-ink"
    data-p5-hot
  >
    <div class="flex items-center gap-2.5">
      <img
        :src="getUrl(ImagePath)"
        :alt="Word"
        class="h-8 w-8 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110"
        loading="lazy"
      />
      <span class="skill__label display text-[0.95rem] leading-none">{{ Word }}</span>
    </div>

    <!-- marching hatch, only while hovered -->
    <span
      class="pointer-events-none absolute inset-0 -z-10 hatch text-ink opacity-0 transition-opacity duration-100 group-hover:opacity-25 group-hover:[animation:p5-hatch_0.6s_linear_infinite]"
      aria-hidden="true"
    ></span>

    <!-- spinning burst -->
    <span
      class="burst pointer-events-none absolute -top-2.5 -right-2.5 h-8 w-8 bg-ink opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:[animation:p5-spin_2.6s_linear_infinite]"
      aria-hidden="true"
    ></span>
  </div>
</template>

<style scoped>
.skill {
  --sk: -8deg;
  transform: skewX(-8deg);
  transition:
    background-color 0.14s steps(2, end),
    border-color 0.14s linear;
}
.skill > * {
  transform: skewX(8deg);
}
.skill:hover {
  background: var(--color-accent);
  border-color: var(--color-ink);
  animation: p5-jitter 0.6s linear infinite;
}
.skill:hover .skill__label {
  animation: p5-jitter 0.6s linear infinite;
}
</style>
