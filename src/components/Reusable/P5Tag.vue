<script setup>
/** Sheared label chip. Fill wipes in + micro-jitter loop on hover. */
defineProps({
  tone: { type: String, default: 'accent' } // accent | data
})
</script>

<template>
  <span class="p5-tag" :class="tone === 'data' ? 'p5-tag--data' : ''">
    <span><slot /></span>
  </span>
</template>
