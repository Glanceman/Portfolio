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
      } catch (__) {}
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

function selectedDisplayMD(file){
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
  <div
    class="w-full h-full grid grid-cols-1 sm:grid-cols-6 sm:gap-2 overflow-y-auto"
    data-aos="fade-up"
    data-aos-duration="1000"
  >
    <div class="bg-white w-full h-full col-span-1 overflow-x-hidden">
      <h1 class="max-sm:hidden text-3xl font-bold my-4 text-pink-600 text-center">Table</h1>
      <!-- for mobile-->
      <h1
        :class="menuOpen? 'bg-pink-700 text-white':''"
        class="sm:hidden text-3xl font-bold py-4 text-pink-600 text-center"
        @click="() => (menuOpen = !menuOpen)"
      >
        {{ selectedMD.name }}
      </h1>
      <div
        :class="
          menuOpen
            ? 'block max-sm:grid max-sm:grid-cols-1 max-sm:bg-pink-700'
            : 'hidden'
        "
        class="hidden absolute w-full sm:static sm:grid sm:grid-cols-1 grid-flow-row auto-rows-max gap-1 p-1"
      >
        <MyButton class="text-lg lg:text-xl" 
        :isActivate="selectedMD.name ===record.name?true:false" :text="record.name" @click="() => selectedDisplayMD(record)" v-for="record in table"/>

      </div>
      <!-- for mobile-->
    </div>

    <div class="w-full bg-white overflow-auto p-4 sm:col-span-5">
      <div
        class="prose-sm sm:prose-base 
        prose-a:text-blue-600 prose-a:break-all
        prose-pre:bg-black prose-pre:rounded-none prose-pre:text-gray-300 prose-pre:overflow-auto prose-p:m-1 
        prose-hr:bg-black prose-hr:h-1 
        prose-h1:text-pink-600 prose-h2:text-pink-600 
        prose-blockquote:bg-slate-200 
        prose-p:text-justify text-wrap"
        v-html="htmlOfMD"
      />
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
