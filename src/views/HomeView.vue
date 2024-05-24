<script setup>
import Typed from 'typed.js'
import { ref, onMounted } from 'vue'
const typing = ref(null)

onMounted(() => {
  new Typed(typing.value, {
    strings: ['Ben', 'Developer', 'Software engineer'],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
  })
})
</script>

<template>
  <div class=" w-screen h-screen bg-gray-200 dark:bg-black">
    <!-- <section class=" text-black dark:text-white">
      <div class="container mx-auto px-4 py-16 text-center">
        <h1 class="text-5xl font-bold mb-4" data-aos="fade-up" data-aos-duration="1000">
          Hi, I'm {{ name }}
        </h1>
        <p class="text-xl mb-8" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
          Welcome to my portfolio website.
        </p>
        <router-link to="/project"
          class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-full transition duration-500 hover:bg-blue-600 hover:shadow-md transform hover:-translate-y-1"
          data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
          View Projects
        </router-link>
      </div>
    </section> -->
    <div class="w-[100%] h-[100%] flex flex-col justify-center">
      <video width="100%" height="100%" autoplay muted loop>
      <source src="/FYP Fast Track Video.mp4" type="video/mp4" />
    </video>
    </div>
    <div class="absolute left-10 bottom-40">
      <div class="text-white lg:text-6xl sm:text-4x1">
        <div class=" m-1">Welcome to my page</div>
        <div>Hi, I am <span ref="typing" class="text-pink-600 font-extrabold"></span></div>
      </div>
    </div>
  </div>
</template>

<style>
.typed-cursor {
  color: rgb(219 39 119);
}
</style>
