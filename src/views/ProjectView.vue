<script setup>
import projects from '@/assets/projects.json'
import { getUrl, } from '@/assets/tools.js'

</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center content-center">
    <div
      class="max-w-7xl mx-auto h-[75%] py-12 px-8 overflow-hidden"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <h1 class="text-3xl font-bold mb-4 text-pink-600">Projects</h1>
      <ul class="grid grid-cols-1 h-full sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-hidden">
        <li v-for="project in projects">
          <div
            class="bg-gray-100 rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 mx-2"
          >
            <img
              :src="getUrl(project.image)"
              :alt="project.name"
              class="h-64 w-full object-cover"
            />
            <div class="p-4">
              <h2 class="text-xl font-bold mb-2 text-black">{{ project.name }}</h2>
              <p class="text-black">
                {{ project.description }}
              </p>
              <a
                :href="project.link"
                class="relative group mt-4 inline-block px-4 py-2 text-pink-700 hover:text-white font-extrabold z-[0]"
              >
                <div>View project</div>
                <span
                  class="block absolute group-hover:bg-pink-700 w-[110%] h-[110%] z-[-1] animate-[myanimation_1s_linear_infinite] top-0 left-0"
                >
                </span>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped>
::-webkit-scrollbar {
    width: 15px;
}
 
/* Track */
::-webkit-scrollbar-track {
    background: white;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
    @apply bg-pink-700;

}
 
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  @apply bg-pink-600 ;
}



</style>