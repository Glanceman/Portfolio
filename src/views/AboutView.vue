<script setup>
import IconCard from '@/components/Reusable/IconCard.vue'
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center content-center">
    <div
      class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white text-black"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <h1 class="text-3xl font-bold mb-4 text-pink-600">About Me</h1>
      <div class="flex flex-col lg:flex-row">
        <div class="w-full md:w-1/2 lg:w-1/3 p-4 mx-auto my-auto">
          <img
            src="/image/icon.png"
            alt="Profile Picture"
            class="mx-auto rounded-full h-64 w-64 object-cover border-4 border-white dark:border-gray-800 hover:border-pink-700 transform transition duration-500 hover:scale-105"
          />
        </div>
        <div class="w-2/3 p-4 mx-auto">
          <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
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
          <div class="w-full" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
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
            <ul class="flex flex-wrap">
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
            <ul class="flex flex-wrap">
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
          <div class="w-full" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
            <div class="w-fit my-1 py-1">
              <h1 class="relative text-3xl w-fit font-extrabold text-black z-10">
                <span
                  class="block absolute bg-pink-700 w-[110%] h-[110%] z-[-1] animate-[myanimation_1s_linear_infinite]"
                >
                </span>
                Contact
              </h1>
            </div>
            <p class="text-black mb-4">
              Email: <a href="mailto: benxian456@gmail.com">benxian456@gmail.com</a>
            </p>
            <a class="text-black mb-4" href="https://github.com/Glanceman">Github</a>
            <span> | </span>
            <a class="text-black mb-4" href="https://www.linkedin.com/in/ben-xian-5831a5228/"
              >Linkedin</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
