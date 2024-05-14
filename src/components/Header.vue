s
<script setup>
import { ref } from 'vue'
import router from '@/router/index.js'
import Footer from '@/components/Footer.vue'
let routes = router.options.routes

let root = ref(null)

defineExpose({
  root
})
</script>

<template>
  <nav
    ref="root"
    id="nav"
    class="absolute left-[100%] h-screen w-1/2 max-w-screen-sm min-w-min px-4 py-2.5 bg-pink-700"
  >
    <div class="flex flex-col w-[100%] h-[100%] place-content-between">
      <ul class="flex flex-col justify-center content-center justify-items-stretch">
        <li v-for="route in routes">
          <router-link :to="route.path" class="block hover:font-extrabold" aria-current="page">
            <div class="text-center text-2xl p-1">
              {{ route.name }}
            </div>
          </router-link>
        </li>
      </ul>
      <Footer />
    </div>
  </nav>
</template>

<style scoped>
#nav a.router-link-exact-active {
  @apply dark:text-white text-white bg-black font-extrabold text-3xl animate-[myanimation_1s_linear_infinite];
}

</style>
