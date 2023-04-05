<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
</script>

<template>
  <Header />
  <RouterView class=" my-3"/>
  <Footer/>
</template>

<script>
export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {

    }
  },
  methods: {

  },
  mounted(){
    import('aos/dist/aos.css');
    import('aos/dist/aos.js').then((AOS) => {
      AOS.init();
    });
  }
}
</script>

<style scoped></style>
