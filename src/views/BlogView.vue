<script setup>
import MarkdownIt from 'markdown-it'
import mk from 'markdown-it-katex'
import { ref, onMounted } from 'vue'
import markdownTable from '/public/blog/markdownTable.json'
import { getUrl } from '@/assets/tools.js'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import 'highlight.js/styles/atom-one-dark-reasonable.min.css'

hljs.registerLanguage('python', python)

let table = ref([])
table.value = markdownTable

console.log(table.value)

let res = ref('')

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

async function diplayMDContent(fileName) {
  let url = getUrl('/blog/' + fileName)
  console.log(url)
  const file = await fetch(url)
  let content = await file.text()
  res.value = markdown.render(content)
}

onMounted(() => {
  // diplay the first content
  diplayMDContent(table.value[0].file)
})
</script>

<template>
  <div
    class="w-full h-full grid grid-cols-1 sm:grid-cols-6 sm:gap-2 overflow-y-auto"
    data-aos="fade-up"
    data-aos-duration="1000"
  >
    <div class="bg-white w-full h-full col-span-1 overflow-x-hidden">
      <div class=" text-3xl font-bold my-4 text-pink-600 text-center">Table</div>
      <!-- for mobile-->
      <div class=" hidden w-full sm:grid sm:grid-cols-1 grid-flow-row auto-rows-max gap-1 p-1">
        <div
          class="relative group inline-block px-4 py-2 text-black hover:text-white font-extrabold z-[0]"
          v-for="record in table"
          @click="() => diplayMDContent(record.file)"
        >
          <p class="text-center text-lg lg:text-xl">{{ record.name }}</p>
          <span
            class="block absolute group-hover:bg-black w-[100%] h-[110%] z-[-1] animate-[myanimation_1s_linear_infinite] top-0 left-0"
          >
          </span>
        </div>
      </div>
    </div>

    <div class="w-full bg-white overflow-auto p-4 sm:col-span-5">
      <div
        class="prose-sm sm:prose-base prose-a:text-blue-600 prose-pre:bg-black prose-pre:rounded-none prose-pre:text-gray-300 prose-pre:overflow-auto prose-p:m-1 prose-hr:bg-black prose-hr:h-1 prose-h1:text-pink-600 prose-h2:text-pink-600 prose-blockquote:bg-slate-200 "
        v-html="res"
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
