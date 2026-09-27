<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * The one button. Skewed on the bias, hard 3px border, and on hover an accent
 * wedge slams in from the leading edge — then the whole thing keeps leaning,
 * jittering and marching hatch, forever, while you stay on it.
 */
const props = defineProps({
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  variant: { type: String, default: 'outline' }, // outline | solid | ghost
  size: { type: String, default: 'md' }, // md | sm
  block: { type: Boolean, default: false }
})

defineEmits(['click'])

const classes = computed(() => [
  'p5-btn',
  props.variant === 'solid' ? 'p5-btn--solid' : '',
  props.variant === 'ghost' ? 'p5-btn--ghost' : '',
  props.size === 'sm' ? 'p5-btn--sm' : '',
  props.block ? 'w-full' : ''
])

const isExternal = computed(() => !!props.href && /^https?:/.test(props.href))
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes" @click="$emit('click')">
    <slot />
  </RouterLink>

  <a
    v-else-if="href"
    :href="href"
    :class="classes"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    @click="$emit('click')"
  >
    <slot />
  </a>

  <button v-else type="button" :class="classes" @click="$emit('click')">
    <slot />
  </button>
</template>
