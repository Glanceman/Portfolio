s
<script setup>
import { ref } from 'vue'
//import router from '@/router/index.js'
import Footer from '@/components/Footer.vue'
import { useRoute, useRouter } from 'vue-router'
import MyButton from './Reusable/MyButton.vue'

const router = useRouter()
const route = useRoute()

let routes = router.options.routes
let root = ref(null)

defineExpose({
  root
})
</script>

<template>
  <nav ref="root" id="nav" class="h-screen w-1/2 max-w-(--breakpoint-sm) min-w-min bg-pink-700">
    <div class="w-full h-full px-2 py-2.5">
      <div class="flex flex-col w-[100%] h-[100%] place-content-between">
        <ul class="flex flex-col justify-center content-center justify-items-stretch">
          <li v-for="r in routes">
            <MyButton
              class="text-2xl"
              :isActivate="route.path === r.path"
              :text="r.name"
              @click="router.push(r.path)"
            />
          </li>
        </ul>
        <Footer />
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
