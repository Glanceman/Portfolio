<script setup>
import Typed from 'typed.js'
import { ref, onMounted } from 'vue'
const typing = ref(null)

onMounted(() => {
  new Typed(typing.value, {
    strings: ['Ben', 'Developer', 'Software engineer','UX/UI designer'],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
  })
})
</script>

<template>
  <div class=" w-screen h-screen bg-gray-200 dark:bg-black">

    <div class="w-[100%] h-[100%] flex flex-col justify-center">
      <video width="100%" height="100%" autoplay muted loop>
      <source src="/FYP Fast Track Video.mp4" type="video/mp4" />
    </video>
    </div>
    <div class="absolute left-10 bottom-40">
      <div class="text-white  text-base sm:text-4xl lg:text-6xl ">
        <p class=" m-1">Welcome to my page</p>
        <p>Hi, I am <span ref="typing" class="text-pink-600 font-extrabold"></span></p>
      </div>
    </div>
  </div>
</template>

<style>
.typed-cursor {
  color: rgb(219 39 119);
}
</style>
