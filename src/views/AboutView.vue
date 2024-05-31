<script setup>
import IconCard from '@/components/Reusable/IconCard.vue'
import Scene from '../components/Scene.vue'
import historyEvents from '@/assets/historyEvent.json'

// Get Work exp
let workHistory = historyEvents.filter((e) => e.type === 'Work')
console.log(workHistory)

let educationHistory = historyEvents.filter((e) => e.type === 'Education')
console.log(educationHistory)
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-around content-center gap-1 overflow-y-auto"
    data-aos="fade-up"
    data-aos-duration="1000"
  >
    <div class="max-w-7xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8 bg-white text-black">
      <h1 class="text-3xl font-bold mb-4 text-pink-600">About Me</h1>
      <div class="flex flex-col lg:flex-row">
        <div class="h-96 w-fit p-2 mx-auto my-auto">
          <Scene />
        </div>

        <div class="md:w-2/3 max-sm:w-full p-4 h-full mx-auto">
          <div class="w-full">
            <div class="w-fit my-1 py-1">
              <h1 class="relative text-3xl w-fit font-extrabold text-black z-10">
                <span
                  class="block absolute bg-pink-700 w-[110%] h-[110%] z-[-1] animate-[myanimation_1s_linear_infinite]"
                >
                </span>
                Introduction
              </h1>
            </div>
            <p class="text-black mb-4">
              Welcome to my portfolio website! I am a creative meida student with a passion for
              programming. Here, you'll find examples of my work in languages like Java, Python, and
              C++, as well as web development technologies like HTML, CSS, and JavaScript. I am
              always eager to learn and grow as a programmer, and I hope my work reflects that.
              Thanks for visiting!
            </p>
          </div>
          <div class="w-full">
            <div class="w-fit my-1 py-1">
              <h1 class="relative text-3xl w-fit font-extrabold text-black z-10">
                <span
                  class="block absolute bg-pink-700 w-[110%] h-[110%] z-[-1] animate-[myanimation_1s_linear_infinite]"
                >
                </span>
                Skills
              </h1>
            </div>
            <div class="text-2x1 font-bold">Programming languages</div>
            <ul class="flex flex-wrap space-x-2">
              <li>
                <IconCard ImagePath="/image/C++.png" Word="C++" />
              </li>
              <li>
                <IconCard ImagePath="/image/CSharp.png" Word="C#" />
              </li>
              <li>
                <IconCard ImagePath="/image/JS.png" Word="JS" />
              </li>
              <li>
                <IconCard ImagePath="/image/HTML5.png" Word="HTML5" />
              </li>
              <li>
                <IconCard ImagePath="/image/CSS3.png" Word="CSS3" />
              </li>
              <li>
                <IconCard ImagePath="/image/Python.png" Word="Python" />
              </li>
            </ul>
            <div class="text-2x1 font-bold">Framework</div>
            <ul class="flex flex-wrap space-x-2">
              <li>
                <IconCard ImagePath="/image/UE5.png" Word="UE5" />
              </li>
              <li>
                <IconCard ImagePath="/image/Unity.png" Word="Unity" />
              </li>
              <li>
                <IconCard ImagePath="/image/Blender.png" Word="Blender" />
              </li>
              <li>
                <IconCard ImagePath="/favicon.ico" Word="Vue3" />
              </li>
              <li>
                <IconCard ImagePath="/image/Pytorch.png" Word="Pytorch" />
              </li>
            </ul>
          </div>
          <div class="w-full">
            <div class="w-fit my-1 py-1">
              <h1 class="relative text-3xl w-fit font-extrabold text-black z-10">
                <span
                  class="block absolute bg-pink-700 w-[110%] h-[110%] z-[-1] animate-[myanimation_1s_linear_infinite]"
                >
                </span>
                Contact
              </h1>
            </div>
            <p class="text-black mb-4 hover:text-pink-600 font-extrabold">
              Email: <a href="mailto: benxian456@gmail.com">benxian456@gmail.com</a>
            </p>
            <a
              class="text-black mb-4 hover:text-pink-600 font-extrabold"
              href="https://github.com/Glanceman"
              >Github</a
            >
            <span> | </span>
            <a
              class="text-black mb-4 hover:text-pink-600 font-extrabold"
              href="https://www.linkedin.com/in/ben-xian-5831a5228/"
              >Linkedin</a
            >
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl w-full py-12 mx-auto px-5 bg-white">
      <h1 class="text-3xl font-bold mb-4 text-pink-600">Education</h1>
      <ol class="relative border-l-4 border-black">
        <li class="mb-10 ms-4" v-for="education in educationHistory">
          <div class="absolute w-3 h-3 bg-pink-600 mt-1.5 -start-1.5"></div>
          <time class="mb-1 text-sm font-normal leading-none text-black"
            >{{ education.from }} - {{ education.to }}</time
          >
          <h3 class="text-lg font-semibold text-black">{{ education.name }}</h3>
          <h4 class="text-base font-semibold text-black">{{ education.organization }}</h4>
          <div class="flex flex-row flex-wrap gap-4 my-1">
                <div
                  class=" px-1 font-bold text-black text-xs lg:text-base border-2 border-black text-center overflow-hidden"
                  v-for="tag in education.tech_stack"
                >
                  {{ tag }}
                </div>
          </div>
          <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            {{ education.description }}
          </p>
        </li>
      </ol>
    </div>

    <div class="max-w-7xl w-full py-12 mx-auto px-5 bg-white">
      <h1 class="text-3xl font-bold mb-4 text-pink-600">Work Experience</h1>
      <ol class="relative border-l-4 border-black">
        <li class="mb-10 ms-4" v-for="work in workHistory">
          <div class="absolute w-3 h-3 bg-pink-600 mt-1.5 -start-1.5"></div>
          <time class="mb-1 text-sm font-normal leading-none text-black"
            >{{ work.from }} - {{ work.to }}</time
          >
          <h3 class="text-lg font-semibold text-black">{{ work.name }}</h3>
          <h4 class="text-base font-semibold text-black">{{ work.organization }}</h4>
          <div class="flex flex-row flex-wrap gap-4 my-1">
                <div
                  class=" px-1 font-bold text-black text-xs lg:text-base border-2 border-black text-center overflow-hidden"
                  v-for="tag in work.tech_stack"
                >
                  {{ tag }}
                </div>
          </div>
          <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            {{ work.description }}
          </p>
        </li>
      </ol>
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
  @apply bg-pink-600;
}
</style>
