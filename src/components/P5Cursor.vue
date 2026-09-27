<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/**
 * P5 cursor: a hard sheared shard that tracks 1:1, trailed by a lagging ring
 * that snaps open and floods with accent the moment you cross anything
 * clickable. Pointer-fine devices only; the native cursor is hidden from CSS
 * *after* this mounts, so if JS never runs you still get a real cursor.
 */
const enabled = ref(false)

const x = ref(0)
const y = ref(0)
const rx = ref(0)
const ry = ref(0)
const hot = ref(false)
const down = ref(false)

let tx = 0
let ty = 0
let raf = 0

const HOT = 'a, button, [data-p5-hot], label, summary'

function onMove(e) {
  tx = e.clientX
  ty = e.clientY
  const el = e.target
  if (el && el.closest) hot.value = !!el.closest(HOT)
}

function onDown() {
  down.value = true
}
function onUp() {
  down.value = false
}
function onLeave() {
  enabled.value = false
}
function onEnter() {
  enabled.value = true
}

function tick() {
  x.value = tx
  y.value = ty
  rx.value += (tx - rx.value) * 0.17
  ry.value += (ty - ry.value) * 0.17
  raf = requestAnimationFrame(tick)
}

const shardStyle = computed(() => ({
  transform: `translate3d(${x.value}px, ${y.value}px, 0) translate(-50%, -50%) skewX(-12deg) scale(${down.value ? 0.72 : 1})`
}))

const ringStyle = computed(() => ({
  transform: `translate3d(${rx.value}px, ${ry.value}px, 0) translate(-50%, -50%) skewX(-12deg) scale(${
    (hot.value ? 2.05 : 1) * (down.value ? 0.7 : 1)
  })`
}))

onMounted(() => {
  if (!window.matchMedia('(pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  enabled.value = true
  document.documentElement.classList.add('p5-cursor-on')

  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mousedown', onDown, { passive: true })
  window.addEventListener('mouseup', onUp, { passive: true })
  document.addEventListener('mouseleave', onLeave)
  document.addEventListener('mouseenter', onEnter)
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('p5-cursor-on')
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mousedown', onDown)
  window.removeEventListener('mouseup', onUp)
  document.removeEventListener('mouseleave', onLeave)
  document.removeEventListener('mouseenter', onEnter)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div v-show="enabled" class="pointer-events-none fixed inset-0 z-[100] hidden md:block" aria-hidden="true">
    <!-- lagging ring -->
    <div
      class="absolute top-0 left-0 h-7 w-7 border-2 transition-[background-color,border-color,opacity] duration-150"
      :class="
        hot
          ? 'border-accent bg-accent/25'
          : 'border-paper/70 bg-transparent'
      "
      :style="ringStyle"
    ></div>

    <!-- leading shard -->
    <div
      class="absolute top-0 left-0 h-3.5 w-3.5 transition-[background-color] duration-100"
      :class="hot ? 'bg-accent' : 'bg-paper'"
      :style="shardStyle"
    ></div>

    <!-- the little sheared tick that makes it read as 'P5' not 'generic dot' -->
    <div
      class="absolute top-0 left-0 h-[2px] w-6 bg-accent transition-opacity duration-150"
      :class="hot ? 'opacity-100 animate-[p5-blink_0.9s_steps(1,end)_infinite]' : 'opacity-0'"
      :style="shardStyle"
    ></div>
  </div>
</template>

<style scoped>
/* applied on <html> only after the component mounts */
:global(html.p5-cursor-on),
:global(html.p5-cursor-on) * {
  cursor: none !important;
}
/* keep an I-beam over selectable prose, but never over a link or button —
   otherwise the cursor vanishes while you are reading the blog */
:global(html.p5-cursor-on) .p5-prose :not(a):not(button),
:global(html.p5-cursor-on) .p5-prose :not(a):not(button) * {
  cursor: text;
}
</style>
