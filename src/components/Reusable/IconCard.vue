<script setup>
import { getUrl } from '@/assets/tools.js'
const props = defineProps(['ImagePath', 'Word'])
let ImagePath = props.ImagePath
let Word = props.Word
</script>

<template>
  <div class="flex items-center space-x-2 bg-white transform-gpu -skew-x-6 px-3 py-1 shadow-md">
    <img :src="getUrl(ImagePath)" class="w-12 h-12" />
    <span class="text-sm font-medium text-black">{{ Word }}</span>
  </div>
</template>
