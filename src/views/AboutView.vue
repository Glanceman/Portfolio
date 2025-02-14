<script setup>
import { inject } from 'vue'

import IconCard from '@/components/Reusable/IconCard.vue'
import Scene from '../components/Scene.vue'
import historyEvents from '@/assets/historyEvent.json'

// Get Work exp
let workHistory = historyEvents.filter((e) => e.type === 'Work')

let educationHistory = historyEvents.filter((e) => e.type === 'Education')
</script>

<template>
  <header className="sticky top-0 z-40 bg-black border-b border-pink-600 ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-3xl font-bold text-pink-600">About Me</h1>
    </div>
  </header>

  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 text-white">
    <section id="introduction" className="space-y-8">
      <h2 className="text-4xl font-extrabold text-pink-600">Introduction</h2>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="lg:w-1/2">
          <p className="text-lg leading-relaxed">
            Welcome to my portfolio website! I am a creative media student with a passion for
            programming. Here, you'll find examples of my work in languages like Java, Python, and
            C++, as well as web development technologies like HTML, CSS, and JavaScript. I am always
            eager to learn and grow as a programmer, and I hope my work reflects that. Thanks for
            visiting!
          </p>
        </div>
        <div className="lg:w-1/2 h-96 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Scene />
        </div>
      </div>
    </section>

    <section id="skills" className="space-y-8">
      <h2 className="text-4xl font-extrabold text-pink-600">Skills</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Programming Languages</h3>
          <div className="flex flex-wrap gap-4">
            <IconCard ImagePath="/image/C++.png" Word="C++" />
            <IconCard ImagePath="/image/CSharp.png" Word="C#" />
            <IconCard ImagePath="/image/JS.png" Word="JS" />
            <IconCard ImagePath="/image/HTML5.png" Word="HTML5" />
            <IconCard ImagePath="/image/CSS3.png" Word="CSS3" />
            <IconCard ImagePath="/image/Python.png" Word="Python" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4">Frameworks</h3>
          <div className="flex flex-wrap gap-4">
            <IconCard ImagePath="/image/UE5.png" Word="UE5" />
            <IconCard ImagePath="/image/Unity.png" Word="Unity" />
            <IconCard ImagePath="/image/Blender.png" Word="Blender" />
            <IconCard ImagePath="/favicon.ico" Word="Vue3" />
            <IconCard ImagePath="/image/Pytorch.png" Word="Pytorch" />
          </div>
        </div>
      </div>
    </section>

    <section id="education" className="space-y-8">
      <h2 className="text-4xl font-extrabold text-pink-600">Education</h2>
      <ol class="relative border-l-4 border-white">
        <li class="mb-10 ms-4 text-white" v-for="education in educationHistory">
          <div className="absolute w-3 h-3 bg-pink-600 mt-1.5 -start-1.5"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400"
            >{{ education.from }} - {{ education.to }}</time
          >
          <h3 className="text-lg font-semibold text-white">{{ education.name }}</h3>
          <h4 className="text-base font-semibold text-pink-400">{{ education.organization }}</h4>
          <div class="flex flex-wrap gap-2 my-2">
            <div
              class="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs font-medium -skew-x-6 transform-gpu"
              v-for="tag in education.tech_stack"
            >
              {{ tag }}
            </div>
          </div>
          <p class="mb-4 text-base font-normal text-gray-300">
            {{ education.description }}
          </p>
        </li>
      </ol>
    </section>

    <section id="education" className="space-y-8">
      <h2 className="text-4xl font-extrabold text-pink-600">Work Experience</h2>
      <ol class="relative border-l-4 border-white">
        <li class="mb-10 ms-4 text-white" v-for="work in workHistory">
          <div className="absolute w-3 h-3 bg-pink-600 mt-1.5 -start-1.5"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400"
            >{{ work.from }} - {{ work.to }}</time
          >
          <h3 className="text-lg font-semibold text-white">{{ work.name }}</h3>
          <h4 className="text-base font-semibold text-pink-400">{{ work.organization }}</h4>
          <div class="flex flex-wrap gap-2 my-2">
            <div
              class="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs font-medium -skew-x-6 transform-gpu"
              v-for="tag in work.tech_stack"
            >
              {{ tag }}
            </div>
          </div>
          <p class="mb-4 text-base font-normal text-gray-300">
            {{ work.description }}
          </p>
        </li>
      </ol>
    </section>
  </main>

  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-extrabold text-pink-600 mb-8">Contact</h2>
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
      >
        <div className="space-y-2">
          <a
            href="mailto:benxian456@gmail.com"
            className="flex items-center space-x-2 hover:text-pink-400 transition-colors"
          >
            <Mail size="{20}" />
            <span>benxian456@gmail.com</span>
          </a>
          <a
            href="https://github.com/Glanceman"
            className="flex items-center space-x-2 hover:text-pink-400 transition-colors"
          >
            <Github size="{20}" />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/ben-xian-5831a5228/"
            className="flex items-center space-x-2 hover:text-pink-400 transition-colors"
          >
            <Linkedin size="{20}" />
            <span>LinkedIn</span>
          </a>
        </div>
        <div className="text-sm text-gray-400">© Ben. All rights reserved.</div>
      </div>
    </div>
  </footer>
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
