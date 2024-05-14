<script setup>
import IconCard from '../components/Reusable/IconCard.vue'
</script>

<template>
  <div
    class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-200 dark:bg-gray-900 dark:text-white rounded-md shadow-md"
    data-aos="fade-up"
    data-aos-duration="1000"
  >
    <h1 class="text-3xl font-bold mb-4">About Me</h1>
    <div class="flex flex-col lg:flex-row">
      <div class="w-full md:w-1/2 lg:w-1/3 p-4 mx-auto my-auto">
        <img
          src="/image/icon.png"
          alt="Profile Picture"
          class="mx-auto rounded-full h-64 w-64 object-cover border-4 border-white dark:border-gray-800 hover:border-indigo-600 transform transition duration-500 hover:scale-105"
        />
      </div>
      <div class="w-full lg:w-2/3 p-4 mx-auto">
        <div class="w-full" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
          <h1
            class="mb-4 text-2xl font-extrabold text-transparent lg:text-3xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
          >
            Introduction
          </h1>
          <p class="text-gray-700 dark:text-gray-400 mb-4">
            Welcome to my portfolio website! I am a creative meida student with a passion for
            programming. Here, you'll find examples of my work in languages like Java, Python, and
            C++, as well as web development technologies like HTML, CSS, and JavaScript. I am always
            eager to learn and grow as a programmer, and I hope my work reflects that. Thanks for
            visiting!
          </p>
        </div>
        <div class="w-full" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
          <h1
            class="mb-4 text-2xl font-extrabold text-transparent lg:text-3xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
          >
            Skill
          </h1>
          <ul class="flex flex-wrap">
            <li>
              <IconCard ImagePath="C++.png" Word="C++" />
            </li>
            <li>
              <IconCard ImagePath="UE5.png" Word="UE5" />
            </li>
            <li>
              <IconCard ImagePath="CSharp.png" Word="C#" />
            </li>
            <li>
              <IconCard ImagePath="JS.png" Word="JS" />
            </li>
            <li>
              <IconCard ImagePath="HTML5.png" Word="HTML5" />
            </li>
            <li>
              <IconCard ImagePath="CSS3.png" Word="CSS3" />
            </li>
            <li>
              <IconCard ImagePath="Python.png" Word="Python" />
            </li>
            <li>
              <IconCard ImagePath="Blender.png" Word="Blender" />
            </li>
          </ul>
        </div>
        <div class="w-full" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
          <h1
            class="mb-4 text-2xl font-extrabold text-transparent lg:text-3xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
          >
            Contact
          </h1>
          <p class="text-gray-700 dark:text-gray-400 mb-4">
            Email: <a href="mailto: benxian456@gmail.com">benxian456@gmail.com</a>
          </p>
          <a class="text-gray-700 dark:text-gray-400 mb-4" href="https://github.com/Glanceman"
            >Github</a
          >
          <span> | </span>
          <a
            class="text-gray-700 dark:text-gray-400 mb-4"
            href="https://www.linkedin.com/in/ben-xian-5831a5228/"
            >Linkedin</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
