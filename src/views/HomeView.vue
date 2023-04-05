<script setup>

</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <section class="text-white">
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
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      name: 'Ben',
    };
  },
  mounted() {

  },
};
</script>
