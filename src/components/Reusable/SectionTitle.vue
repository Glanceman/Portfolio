<script setup>
/** P5 section header: sheared accent bar, stamped index, huge display type. */
defineProps({
  index: { type: [String, Number], default: '' },
  kicker: { type: String, default: '' },
  title: { type: String, required: true },
  tone: { type: String, default: 'accent' } // accent | data | paper
})
</script>

<template>
  <div class="relative">
    <div class="flex items-end gap-4 sm:gap-5">
      <!-- the shear bar -->
      <span
        class="slant block w-3 shrink-0 self-stretch sm:w-4"
        :class="{
          'bg-accent': tone === 'accent',
          'bg-data': tone === 'data',
          'bg-paper': tone === 'paper'
        }"
        aria-hidden="true"
      ></span>

      <div class="min-w-0 -skew-x-6">
        <p
          v-if="index || kicker"
          class="stamp mb-2 flex flex-wrap items-center gap-x-3 gap-y-1"
          :class="{
            'text-accent': tone === 'accent',
            'text-data': tone === 'data',
            'text-mute': tone === 'paper'
          }"
        >
          <span v-if="index" class="inline-block">// {{ index }}</span>
          <span v-if="kicker" class="inline-block">{{ kicker }}</span>
        </p>
        <h2 class="display text-[clamp(2.1rem,7vw,4.2rem)] text-paper">
          <slot>{{ title }}</slot>
        </h2>
      </div>
    </div>

    <!-- diagonal hatch rule -->
    <div
      class="p5-rule mt-4 opacity-70"
      :style="{
        color: tone === 'data' ? 'var(--color-data)' : 'var(--color-accent)'
      }"
      aria-hidden="true"
    ></div>
  </div>
</template>
