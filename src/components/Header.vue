<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

/**
 * The command menu.
 * - lg+ : a permanent left rail with its bottom-right corner sheared off
 * - <lg : an off-canvas panel that slams in from the right, top-left corner cut
 */
const props = defineProps({
  open: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'toggle-collapse'])

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
  { label: 'Github', short: 'GH', href: 'https://github.com/Glanceman' },
  { label: 'LinkedIn', short: 'IN', href: 'https://www.linkedin.com/in/ben-xian-5831a5228/' },
  { label: 'Email', short: '@', href: 'mailto:benxian456@gmail.com' }
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
           border-l-2 border-paper
           transition-[width,transform] duration-300 ease-[cubic-bezier(0.2,0.9,0.2,1)]
           lg:left-0 lg:right-auto lg:z-40 lg:translate-x-0 lg:border-r-2 lg:border-l-0"
    :class="[
      props.open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
      props.collapsed ? 'lg:w-rail-min' : 'lg:w-rail'
    ]"
    :inert="railInert ? '' : undefined"
  >
    <!-- The shear is a BACKGROUND layer. Content sits above it unclipped, so a
         collapsed item's hover fly-out can escape the rail's slanted edge. -->
    <div class="p5-rail-clip pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="absolute inset-0 bg-ink-2"></div>
      <div
        class="halftone absolute inset-0 text-paper opacity-[0.05] animate-[p5-dots_24s_ease-in-out_infinite]"
      ></div>
      <div
        class="hatch-fat absolute -top-10 -right-16 h-72 w-[150%] text-accent opacity-[0.07] rotate-[14deg]"
      ></div>
      <div class="slant-lg absolute -bottom-24 -left-16 h-80 w-32 bg-accent opacity-[0.09]"></div>
    </div>

    <!-- desktop: collapse / expand, straddling the rail edge so it is reachable
         whether the rail is 19rem or 6rem wide -->
    <button
      type="button"
      class="p5-btn p5-btn--sm absolute -right-3 top-5 z-30 hidden !px-2.5 !py-2 lg:flex"
      :aria-label="props.collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      :aria-expanded="!props.collapsed"
      aria-controls="nav"
      data-p5-hot
      @click="emit('toggle-collapse')"
    >
      <span class="text-sm leading-none" aria-hidden="true">{{ props.collapsed ? '»' : '«' }}</span>
    </button>

    <!-- content (never clipped) -->
    <div class="relative z-10 flex min-h-0 flex-1 flex-col">
    <!-- logo -->
    <RouterLink
      to="/"
      class="group relative block pb-5 lg:pt-7"
      :class="props.collapsed ? 'px-3 pt-9 lg:pt-9' : 'px-5 pt-9'"
      data-p5-hot
      @click="emit('close')"
    >
      <div class="flex items-center gap-3.5" :class="props.collapsed ? 'lg:justify-center' : ''">
        <span
          class="burst grid h-12 w-12 shrink-0 place-items-center bg-accent transition-transform duration-300 group-hover:rotate-180"
          aria-hidden="true"
        >
          <span class="display -skew-x-6 text-2xl text-ink">B</span>
        </span>
        <span class="min-w-0" :class="props.collapsed ? 'lg:hidden' : ''">
          <span class="display block text-[1.9rem] leading-none text-paper">Ben</span>
          <span class="stamp block text-accent">Portfolio / 2.0</span>
        </span>
      </div>
      <div class="p5-rule mt-5 opacity-60" aria-hidden="true"></div>
    </RouterLink>

    <!-- nav -->
    <nav class="relative min-h-0 flex-1 overflow-y-auto px-4 pt-2" :class="props.collapsed ? 'lg:px-2' : ''">
      <p class="stamp px-3 pb-3 text-mute" :class="props.collapsed ? 'lg:hidden' : ''">
        — Command
      </p>
      <ul class="space-y-1.5">
        <li v-for="r in routes" :key="r.path">
          <RouterLink
            :to="r.path"
            class="p5-nav-item"
            :class="[
              { 'p5-nav-item--on': route.path === r.path },
              props.collapsed ? 'p5-nav-item--fly lg:justify-center lg:px-2' : ''
            ]"
            :title="props.collapsed ? r.meta.label : undefined"
            :aria-current="route.path === r.path ? 'page' : undefined"
            data-p5-hot
            @click="emit('close')"
          >
            <span class="flex min-w-0 items-baseline gap-3" :class="props.collapsed ? 'lg:justify-center' : ''">
              <span class="stamp w-6 shrink-0 opacity-70">{{ r.meta.num }}</span>
              <span
                class="p5-nav-item__label display truncate text-[1.7rem]"
                :class="props.collapsed ? 'lg:hidden' : ''"
              >
                {{ r.meta.label }}
              </span>
            </span>
            <span
              class="stamp shrink-0 opacity-0 transition-opacity duration-150 [.p5-nav-item:hover_&]:opacity-100"
              :class="props.collapsed ? 'lg:hidden' : ''"
              aria-hidden="true"
            >
              ▶
            </span>

            <!-- collapsed: the label slams out to the right on hover -->
            <span
              v-if="props.collapsed"
              class="p5-flyout stamp absolute top-0 left-full z-20 ml-2 hidden items-center whitespace-nowrap border-2 border-ink bg-accent px-3 py-1.5 text-ink opacity-0 transition-opacity duration-150 [.p5-nav-item:hover_&]:opacity-100 lg:flex"
              aria-hidden="true"
            >
              {{ r.meta.label }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- socials + colophon.
         The clipped background removes a 56px triangle from the bottom-right,
         so the content must stop at least 56px above the floor. 80px of padding
         leaves a comfortable margin. -->
    <div class="relative shrink-0 border-t-2 border-paper px-4 py-5 lg:pb-20" :class="props.collapsed ? 'lg:px-2' : ''">
      <p class="stamp px-3 pb-2 text-mute" :class="props.collapsed ? 'lg:hidden' : ''">
        — Elsewhere
      </p>
      <ul class="space-y-1">
        <li v-for="s in socials" :key="s.label">
          <a
            :href="s.href"
            class="p5-nav-item text-paper"
            :class="props.collapsed ? 'lg:justify-center lg:px-2' : ''"
            :title="props.collapsed ? s.label : undefined"
            :target="s.href.startsWith('http') ? '_blank' : undefined"
            :rel="s.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            data-p5-hot
          >
            <span
              class="p5-nav-item__label stamp"
              :class="props.collapsed ? 'lg:hidden' : ''"
            >
              {{ s.label }}
            </span>
            <span
              class="display text-sm shrink-0"
              :class="props.collapsed ? '' : 'hidden'"
              aria-hidden="true"
            >
              {{ s.short }}
            </span>
            <span
              class="shrink-0 opacity-0 transition-opacity duration-150 [.p5-nav-item:hover_&]:opacity-100"
              :class="props.collapsed ? 'lg:hidden' : ''"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        </li>
      </ul>

      <p class="stamp mt-5 px-3 text-mute/70" :class="props.collapsed ? 'lg:hidden' : ''">
        Vue 3 · Tailwind
      </p>
    </div>
    </div>
  </aside>
</template>

<style scoped>
/* The shear now lives on a background layer, not on the rail itself, so the
   rail's own box (and therefore the page gutter) is a clean rectangle. */
.p5-rail-clip {
  clip-path: polygon(28px 0, 100% 0, 100% 100%, 0 100%);
}
@media (min-width: 64rem) {
  .p5-rail-clip {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 56px), 0 100%);
  }
  /* a collapsed item's label must be able to fly out past the rail edge,
     so it cannot clip its own overflow */
  .p5-nav-item--fly {
    overflow: visible;
  }
}
</style>
