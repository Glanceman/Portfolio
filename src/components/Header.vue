<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

/**
 * The command menu.
 * - lg+ : a permanent left rail with its bottom-right corner sheared off
 * - <lg : an off-canvas panel that slams in from the right, top-left corner cut
 */
const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const router = useRouter()
const route = useRoute()
const routes = router.options.routes

/* When the mobile panel is closed it is translated off-screen but its links
   would still be reachable by keyboard. `inert` takes them out of the tab
   order — but only while the panel is actually off-canvas, so the desktop
   rail stays fully operable. */
const isDesktop = ref(false)
let mq = null
function syncBreakpoint() {
  isDesktop.value = mq.matches
}
onMounted(() => {
  mq = window.matchMedia('(min-width: 64rem)')
  syncBreakpoint()
  mq.addEventListener('change', syncBreakpoint)
})
onBeforeUnmount(() => mq?.removeEventListener('change', syncBreakpoint))

const railInert = computed(() => !props.open && !isDesktop.value)

const socials = [
  { label: 'Github', href: 'https://github.com/Glanceman' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ben-xian-5831a5228/' },
  { label: 'Email', href: 'mailto:benxian456@gmail.com' }
]
</script>

<template>
  <!-- scrim for the mobile panel only -->
  <div
    v-if="props.open"
    class="fixed inset-0 z-40 bg-ink/80 backdrop-blur-[2px] lg:hidden"
    @click="emit('close')"
  ></div>

  <aside
    id="nav"
    class="p5-rail fixed top-0 right-0 z-50 flex h-screen w-[86vw] max-w-[22rem] flex-col
           border-l-2 border-paper bg-ink-2
           transition-transform duration-300 ease-[cubic-bezier(0.2,0.9,0.2,1)]
           lg:left-0 lg:right-auto lg:z-40 lg:w-[19rem] lg:translate-x-0 lg:border-r-2 lg:border-l-0"
    :class="props.open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
    :inert="railInert ? '' : undefined"
  >
    <!-- comic furniture -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        class="halftone absolute inset-0 text-paper opacity-[0.05] animate-[p5-dots_24s_ease-in-out_infinite]"
      ></div>
      <div
        class="hatch-fat absolute -top-10 -right-16 h-72 w-[150%] text-accent opacity-[0.07] rotate-[14deg]"
      ></div>
      <div class="slant-lg absolute -bottom-24 -left-16 h-80 w-32 bg-accent opacity-[0.09]"></div>
    </div>

    <!-- logo -->
    <RouterLink
      to="/"
      class="group relative block px-5 pt-9 pb-5 lg:pt-7"
      data-p5-hot
      @click="emit('close')"
    >
      <div class="flex items-center gap-3.5">
        <span
          class="burst grid h-12 w-12 shrink-0 place-items-center bg-accent transition-transform duration-300 group-hover:rotate-180"
          aria-hidden="true"
        >
          <span class="display -skew-x-6 text-2xl text-ink">B</span>
        </span>
        <span class="min-w-0">
          <span class="display block text-[1.9rem] leading-none text-paper">Ben</span>
          <span class="stamp block text-accent">Portfolio / 2.0</span>
        </span>
      </div>
      <div class="p5-rule mt-5 opacity-60" aria-hidden="true"></div>
    </RouterLink>

    <!-- nav -->
    <nav class="relative flex-1 overflow-y-auto px-4 pt-2">
      <p class="stamp px-3 pb-3 text-mute">— Command</p>
      <ul class="space-y-1.5">
        <li v-for="r in routes" :key="r.path">
          <RouterLink
            :to="r.path"
            class="p5-nav-item"
            :class="{ 'p5-nav-item--on': route.path === r.path }"
            :aria-current="route.path === r.path ? 'page' : undefined"
            data-p5-hot
            @click="emit('close')"
          >
            <span class="flex min-w-0 items-baseline gap-3">
              <span class="stamp w-6 shrink-0 opacity-70">{{ r.meta.num }}</span>
              <span class="p5-nav-item__label display truncate text-[1.7rem]">{{ r.meta.label }}</span>
            </span>
            <span
              class="stamp shrink-0 opacity-0 transition-opacity duration-150 [.p5-nav-item:hover_&]:opacity-100"
              aria-hidden="true"
            >
              ▶
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- socials + colophon.
         The extra bottom padding on lg clears the sheared corner of the rail
         so no real content ever falls inside the clip. -->
    <div class="relative border-t-2 border-paper px-4 py-5 lg:pb-16">
      <p class="stamp px-3 pb-2 text-mute">— Elsewhere</p>
      <ul class="space-y-1">
        <li v-for="s in socials" :key="s.label">
          <a
            :href="s.href"
            class="p5-nav-item text-paper"
            :target="s.href.startsWith('http') ? '_blank' : undefined"
            :rel="s.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            data-p5-hot
          >
            <span class="p5-nav-item__label stamp">{{ s.label }}</span>
            <span
              class="shrink-0 opacity-0 transition-opacity duration-150 [.p5-nav-item:hover_&]:opacity-100"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        </li>
      </ul>

      <p class="stamp mt-5 px-3 text-mute/70">Vue 3 · Tailwind · Three inks</p>
    </div>
  </aside>
</template>

<style scoped>
/* the shear is different per breakpoint, so it lives in CSS not utilities */
.p5-rail {
  clip-path: polygon(28px 0, 100% 0, 100% 100%, 0 100%);
}
@media (min-width: 64rem) {
  .p5-rail {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 56px), 0 100%);
  }
}
</style>
