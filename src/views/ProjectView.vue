<script setup>
import projects from '@/assets/projects.json'
import { getUrl } from '@/assets/tools.js'
</script>

<template>
  <header className="sticky top-0 z-40 bg-black border-b border-pink-600 ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-3xl font-bold text-pink-600">Projects</h1>
    </div>
  </header>

  <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
    <li v-for="project in projects">
      <div
        class="bg-white/10 rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 mx-2"
      >
        <img :src="getUrl(project.image)" :alt="project.name" class="w-full h-48 object-cover" />
        <div class="p-6">
          <h2 className="text-2xl font-bold mb-2 text-pink-500">{{ project.name }}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              class="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs font-medium -skew-x-6 transform-gpu"
              v-for="tag in project.tag"
            >
              {{ tag }}
            </span>
          </div>

          <p className="text-gray-300 mb-4">{{ project.description }}</p>
          <a
            :href="project.link"
            class="relative group mt-4 inline-block px-4 py-2 text-pink-700 hover:text-white font-extrabold z-0"
          >
            <p>View project</p>

            <span
              class="block absolute group-hover:bg-pink-700 w-[110%] h-[110%] z-[-1] animate-[myanimation_1s_linear_infinite] top-0 left-0"
            >
            </span>
          </a>
        </div>
      </div>
    </li>
  </main>
</template>

<style scoped>
@reference "../assets/main.css";

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
  @apply bg-pink-600;
}
</style>
