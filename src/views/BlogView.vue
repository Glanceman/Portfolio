<script setup>
import MarkdownIt from 'markdown-it'
import mk from 'markdown-it-katex'
import { ref, onMounted } from 'vue'
import markdownTable from '/public/blog/markdownTable.json'
import { getUrl } from '@/assets/tools.js'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import cpp from 'highlight.js/lib/languages/cpp'
import js from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/atom-one-dark-reasonable.min.css'
import MyButton from '../components/Reusable/MyButton.vue'

//registry
hljs.registerLanguage('python', python)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('js', js)

// get list of MDs
let table = ref([])
table.value = markdownTable

let menuOpen = ref(false)

const markdown = new MarkdownIt({
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        let res = hljs.highlight(str, { language: lang }).value
        return res
      } catch (__) { }
    }
    return '' // use external default escaping
  }
})
markdown.use(mk)

let selectedMD = ref('')
let htmlOfMD = ref('')
async function diplayMDContent(fileName) {
  let url = getUrl('/blog/' + fileName)
  const file = await fetch(url)
  let content = await file.text()
  htmlOfMD.value = markdown.render(content)
}

function selectedDisplayMD(file) {
  selectedMD.value = file
  diplayMDContent(selectedMD.value.file)
  //menuOpen.value=false
}

onMounted(() => {
  // select the first MD
  selectedDisplayMD(table.value[0])
})
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <header class="sticky top-0 z-40 bg-black border-b border-pink-600 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 items-center">
        <button @click="menuOpen = !menuOpen" class="sm:hidden text-pink-600 focus:outline-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <h1 class="text-2xl sm:text-3xl font-bold text-pink-600">{{ selectedMD.name }}</h1>
      </div>
    </header>

    <main class="w-full flex flex-col sm:flex-row">
      <!-- ^^^This detemine the height sticky need to look for this -->
      <aside :class="{
        'hidden sm:block': !menuOpen,
        'block sticky top-16 animate-[fadeIn_0.5s_linear]': menuOpen
      }" class="w-full flex-none bg-gray-900 sm:w-72 sm:min-h-screen">
        <nav class="sm:sticky sm:top-16 p-4">
          <h2 class="text-2xl font-bold mb-4 text-pink-600 text-center">Table of Contents</h2>
          <div class="space-y-2">
            <MyButton class="text-lg lg:text-xl" v-for="record in table"
              :isActivate="selectedMD.name === record.name ? true : false" :text="record.name" textColor="text-white"
              activateTextColor="text-black" windowColor="bg-pink-600" @click="() => selectedDisplayMD(record)" />
          </div>
        </nav>
      </aside>
      <article class="p-2 sm:p-4 min-w-0">
        <div class="prose prose-invert prose-pink max-w-none" v-html="htmlOfMD"></div>
      </article>
    </main>
  </div>
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
