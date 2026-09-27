<script setup>
import { ref, watch, onMounted, onBeforeUnmount, provide } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import Header from '@/components/Header.vue'
import BackdropFX from '@/components/BackdropFX.vue'
import P5Cursor from '@/components/P5Cursor.vue'

const route = useRoute()
const menuOpen = ref(false)
const shutterKey = ref(0)
const shutterOn = ref(false)
const progress = ref(0)

/* --- collapsible command rail (desktop) --- */
const RAIL_KEY = 'p5-rail-collapsed'
const railCollapsed = ref(false)
try {
  railCollapsed.value = localStorage.getItem(RAIL_KEY) === '1'
} catch {
  /* private mode / storage disabled — collapsing just won't persist */
}
function toggleRail() {
  railCollapsed.value = !railCollapsed.value
  try {
    localStorage.setItem(RAIL_KEY, railCollapsed.value ? '1' : '0')
  } catch {
    /* ignore */
  }
}

function closeMenu() {
  menuOpen.value = false
}
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
provide('closeMenu', closeMenu)

/* --- diagonal shutter sweep between routes ---
   The element is mounted for the length of the animation and then removed. A
   filled-forwards animation that never gets torn down can only ever end up
   parked somewhere on screen if the timing is ever wrong. */
let shutterTimer = null
function fireShutter() {
  window.clearTimeout(shutterTimer)
  shutterOn.value = false
  // next frame so the element is re-created and the animation restarts
  requestAnimationFrame(() => {
    shutterKey.value++
    shutterOn.value = true
    shutterTimer = window.setTimeout(() => (shutterOn.value = false), 640)
  })
}
onMounted(fireShutter)
watch(
  () => route.fullPath,
  () => {
    closeMenu()
    fireShutter()
  }
)

/* --- reading progress, P5 style --- */
function onScroll() {
  const el = document.documentElement
  const max = el.scrollHeight - el.clientHeight
  progress.value = max > 0 ? Math.min(1, el.scrollY / max) : 0
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.clearTimeout(shutterTimer)
})
</script>

<template>
  <BackdropFX />
  <P5Cursor />

  <Header
    :open="menuOpen"
    :collapsed="railCollapsed"
    @close="closeMenu"
    @toggle-collapse="toggleRail"
  />

  <!-- menu trigger (small screens only) -->
  <button
    type="button"
    class="p5-btn p5-btn--sm fixed top-4 right-4 z-[60] !px-3 !py-2.5 lg:hidden"
    :aria-expanded="menuOpen"
    aria-controls="nav"
    aria-label="Toggle menu"
    data-p5-hot
    @click="toggleMenu"
  >
    <span class="relative block h-4 w-5" aria-hidden="true">
      <span
        class="absolute left-0 h-[3px] w-full bg-current transition-transform duration-200"
        :class="menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'"
      ></span>
      <span
        class="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 transition-opacity duration-150"
        :class="menuOpen ? 'opacity-0' : 'opacity-100'"
      ></span>
      <span
        class="absolute left-0 h-[3px] w-full bg-current transition-transform duration-200"
        :class="menuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'"
      ></span>
    </span>
  </button>

  <!-- reading progress -->
  <div
    class="pointer-events-none fixed top-0 right-0 z-[55] h-[5px] transition-[left] duration-300 ease-[cubic-bezier(0.2,0.9,0.2,1)]"
    :class="railCollapsed ? 'lg:left-rail-min' : 'lg:left-rail'"
    aria-hidden="true"
  >
    <div
      class="h-full bg-accent transition-[width] duration-100 ease-linear"
      :style="{ width: progress * 100 + '%' }"
    ></div>
    <div class="absolute inset-0 hatch text-ink opacity-20"></div>
  </div>

  <!-- route transition: a diagonal slash rips across on navigation -->
  <div
    v-if="shutterOn"
    :key="'shutter' + shutterKey"
    class="pointer-events-none fixed inset-0 z-[58] overflow-hidden"
    aria-hidden="true"
  >
    <div
      v-for="(bar, i) in [
        { c: 'bg-accent', w: 'w-[26vw] min-w-[190px]', d: '0ms' },
        { c: 'bg-paper', w: 'w-[5vw] min-w-[34px]', d: '70ms' }
      ]"
      :key="i"
      class="absolute top-[-30%] h-[160%] will-change-transform"
      :class="[bar.c, bar.w]"
      :style="{ animation: `p5-shutter 0.46s cubic-bezier(0.8, 0, 0.2, 1) ${bar.d} both` }"
    ></div>
  </div>

  <div
    class="transition-transform duration-300 ease-[cubic-bezier(0.2,0.9,0.2,1)] lg:translate-x-0"
    :class="menuOpen ? '-translate-x-[24%] lg:translate-x-0' : 'translate-x-0'"
  >
    <main
      class="min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.2,0.9,0.2,1)]"
      :class="railCollapsed ? 'lg:pl-rail-min' : 'lg:pl-rail'"
    >
      <!--
        NOTE: do NOT add mode="out-in" here.
        vue-router hands the slot a pre-created VNode rather than a component
        definition. Transition's out-in mode renders a placeholder during the
        leave phase and swaps on the next tick, which hands Transition an
        `undefined` child — the route then renders nothing at all and the
        console fills with "Invalid vnode type when creating vnode: undefined".
        The default simultaneous mode is correct for a VNode child, and an
        overlapping cut is the more P5 transition anyway.
      -->
      <RouterView v-slot="{ Component }">
        <Transition name="p5-view">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
/*
 * `forwards`, not `both`.
 *
 * `both` applies the 0% keyframe (opacity 0) during the animation's backwards
 * phase — so if an enter transition is ever interrupted or never starts, the
 * view is left permanently invisible with no way to recover. `forwards` only
 * holds the END state, so the element is visible by default and the animation
 * is pure decoration on top.
 */
.p5-view-enter-active {
  animation: p5-rise 0.45s cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
}
.p5-view-leave-active {
  animation: p5-fade 0.16s linear forwards;
}
</style>
