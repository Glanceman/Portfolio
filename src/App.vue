<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from './components/Footer.vue'
import { ref, computed, onMounted, toRaw } from 'vue'
import('aos/dist/aos.css')

import('aos/dist/aos.js').then((AOS) => {
  AOS.init()
})

const menu = ref(null)
const page = ref(null) // get the page
let offsetX = ref('0px')
let menuState = ref('Close')

//v-directive
const vResize = {
  mounted: (el, binding) => {
    const onResizeCallback = binding.value
    window.addEventListener('resize', () => {
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight
      onResizeCallback(width, height)
    })
  },
  unmounted: (el, binding, vnode, prevVnode) => {
    console.log('unmounted')
    window.removeEventListener('resize')
  }
}

function handleResize(width, height) {
  console.log('trigger Resize', width, height)
  offsetX.value = menu.value.root.offsetWidth + 'px'
}

function TriggerMenu() {
  console.log('trigger')
  const pageComponent = page.value
  if (menuState.value == 'Close') {
    offsetX.value = Math.floor(menu.value.root.offsetWidth) + 'px'
    pageComponent.classList.add('myTranslate')
    menuState.value = 'Open'
  } else {
    menuState.value = 'Close'
    pageComponent.classList.remove('myTranslate')
  }
  console.log(menu)
  console.log(offsetX.value)
}

onMounted(() => {
  offsetX.value = menu.value.root.offsetWidth + 'px'
})
</script>

<template>
  <div v-resize="handleResize" class="overflow-hidden">
    <div ref="page" class="w-screen h-screen relative transition-transform ease-in-out">
      <Header ref="menu" />

      <div class="w-full h-full">
        <RouterView />
      </div>
      <button
        type="button"
        class="absolute top-10 right-10 rounded-lg size-16 px-auto py-auto"
        @click="TriggerMenu"
      >
        <div
          class="flex justify-center hover:bg-pink-700 hover:animate-[myanimation_1s_linear_infinite]"
        >
          <div v-if="menuState === 'Open'">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="white"
              class="bi bi-three-dots-vertical stroke-black stroke-[0.5]"
              viewBox="0 0 16 16"
            >
              <path
                d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
              />
            </svg>
          </div>
          <div v-if="menuState === 'Close'">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="white"
              class="bi bi-list stroke-black stroke-[0.5]"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </div>
        </div>
      </button>
    </div>
  </div>
  <!-- <Footer /> -->
</template>

<style scoped>
.myTranslate {
  transform: translateX(calc(v-bind(offsetX) * -1));
}
</style>
