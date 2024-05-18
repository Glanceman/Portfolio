<script setup>
import { getUrl, } from '@/assets/tools.js'
const props = defineProps(['ImagePath','Word'])
let ImagePath = props.ImagePath
let Word = props.Word

</script>

<template>
  <div>
    <img :src="getUrl(ImagePath)" class="w-12 h-12" />
    <p class="text-back">{{ Word }}</p>
  </div>
</template>
