<script setup>
import P5Tag from './P5Tag.vue'

defineProps({
  items: { type: Array, required: true },
  tone: { type: String, default: 'accent' } // accent | data
})
</script>

<template>
  <ol class="relative space-y-6 pl-12 sm:pl-16">
    <!-- the spine -->
    <span
      class="absolute left-[15px] top-2 bottom-2 w-[3px] sm:left-[23px]"
      :class="tone === 'data' ? 'bg-data' : 'bg-accent'"
      aria-hidden="true"
    ></span>
    <span
      class="absolute left-[15px] top-2 bottom-2 w-[3px] sm:left-[23px] hatch text-ink opacity-25 animate-[p5-hatch_1.4s_linear_infinite]"
      aria-hidden="true"
    ></span>

    <li v-for="(e, i) in items" :key="e.name + i" class="relative">
      <!-- node is 18px wide and must sit centred on the 3px spine:
           left = spine_x - 9 - ol_padding  →  -42px (mobile), -50px (sm) -->
      <span
        class="p5-node absolute top-6 left-[-42px] z-10 sm:left-[-50px]"
        :class="tone === 'data' ? '!bg-data' : '!bg-accent'"
        aria-hidden="true"
      ></span>

      <article
        class="p5-card group p-5 sm:p-6"
        data-p5-hot
      >
        <div class="p5-card__body">
          <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 class="p5-card__title display text-2xl text-paper sm:text-[1.7rem]">
              {{ e.name }}
            </h3>
            <p
              class="stamp shrink-0"
              :class="tone === 'data' ? 'text-data' : 'text-accent'"
            >
              {{ e.from }} → {{ e.to }}
            </p>
          </div>

          <p class="mt-1.5 text-sm font-semibold text-paper/80">{{ e.organization }}</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <P5Tag
              v-for="t in e.tech_stack"
              :key="t"
              :tone="tone === 'data' ? 'data' : 'accent'"
            >
              {{ t }}
            </P5Tag>
          </div>

          <p class="mt-4 max-w-2xl leading-relaxed text-paper/65">{{ e.description }}</p>
        </div>
      </article>
    </li>
  </ol>
</template>
