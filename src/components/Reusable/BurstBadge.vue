<script setup>
/**
 * Comic "POW" badge. The jagged star spins slowly, the wedge hatching marches,
 * and it goes hard on hover.
 */
defineProps({
  text: { type: String, required: true },
  tone: { type: String, default: 'accent' } // accent | data | ink
})
</script>

<template>
  <span
    class="burst relative isolate inline-grid place-items-center select-none"
    :class="{
      'text-ink': tone === 'accent' || tone === 'data',
      'text-accent': tone === 'ink'
    }"
  >
    <span
      class="absolute inset-0 -z-10 animate-[p5-spin_9s_linear_infinite]"
      :class="{
        'bg-accent': tone === 'accent',
        'bg-data': tone === 'data',
        'bg-paper': tone === 'ink'
      }"
      aria-hidden="true"
    ></span>
    <span
      class="absolute inset-0 -z-10 hatch text-ink opacity-20 animate-[p5-hatch_0.7s_linear_infinite]"
      aria-hidden="true"
    ></span>
    <span class="unslant stamp px-1 py-2 text-center leading-tight font-bold text-ink">
      <slot>{{ text }}</slot>
    </span>
  </span>
</template>
