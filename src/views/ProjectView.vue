<script setup>
import projects from '@/assets/projects.json'



let temp = import.meta.env
let base_url =temp.BASE_URL
base_url = base_url.slice(0,base_url.length-1)
console.log(base_url)
function getUrl(path) {
  let tmp = new URL(base_url+path,import.meta.url)
  let href = tmp.href
  return href
}
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center content-center">
    <div
      class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <h1 class="text-3xl font-bold mb-4 text-pink-600">Projects</h1>
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <li v-for="project in projects">
          <div
            class="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105"
          >
            <img
              :src="getUrl(project.image)"
              :alt="project.name"
              class="h-64 w-full object-cover"
            />
            <div class="p-4">
              <h2 class="text-xl font-bold mb-2 text-white">{{ project.name }}</h2>
              <p class="text-gray-700 dark:text-gray-400">
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
