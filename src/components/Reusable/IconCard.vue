<script setup>
const props = defineProps(['ImagePath','Word'])
let ImagePath = props.ImagePath
let Word = props.Word



let temp = import.meta.env
let base_url =temp.BASE_URL
base_url = base_url.slice(0,base_url.length-1)
console.log(getImageUrl())
function getImageUrl() {
  // This path must be correct for your file
  let tmp = new URL(base_url+ImagePath,import.meta.url)
  let href = tmp.href
  return href
}

</script>

<template>
  <div>
    <img :src="getImageUrl()" class="w-12 h-12" />
    <p class="text-back">{{ Word }}</p>
  </div>
</template>
