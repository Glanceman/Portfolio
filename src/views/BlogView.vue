<script setup>
import MarkdownIt from 'markdown-it'
import mk from 'markdown-it-katex'
import { ref, onMounted } from 'vue'
import markdownTable from '@/assets/blogIndex.json'
import { getUrl } from '@/assets/tools.js'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import cpp from 'highlight.js/lib/languages/cpp'
import js from 'highlight.js/lib/languages/javascript'
import SectionTitle from '@/components/Reusable/SectionTitle.vue'

// registry
hljs.registerLanguage('python', python)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('js', js)

// get list of MDs
const table = ref([])
table.value = markdownTable

const tocOpen = ref(false)

const markdown = new MarkdownIt({
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {
        /* fall through to default escaping */
      }
    }
    return ''
  }
})
markdown.use(mk)

const selectedMD = ref('')
const htmlOfMD = ref('')
const loading = ref(false)

async function displayMDContent(fileName) {
  loading.value = true
  try {
    const url = getUrl('/blog/' + fileName)
    const file = await fetch(url)
    const content = await file.text()
    htmlOfMD.value = markdown.render(content)
  } finally {
    loading.value = false
  }
}

function selectedDisplayMD(file) {
  selectedMD.value = file
  tocOpen.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
  displayMDContent(selectedMD.value.file)
}

onMounted(() => {
  selectedDisplayMD(table.value[0])
})
</script>

<template>
  <div class="min-h-screen">
    <!-- ===================== masthead ===================== -->
    <header class="relative overflow-hidden border-b-2 border-paper">
      <div class="halftone absolute inset-0 text-paper opacity-[0.06]" aria-hidden="true"></div>
      <div
        class="slant-lg absolute -top-24 right-[10%] h-80 w-24 bg-data opacity-[0.12] animate-[p5-drift-a_29s_ease-in-out_infinite]"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto max-w-[85rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
        <p class="stamp mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-data">
          <span>// 04</span><span>Notes</span>
        </p>
        <h1 class="display text-[clamp(3rem,12vw,8.5rem)] text-paper">
          Blog<span class="text-data">.</span>
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
          Cheat sheets, scratch notes and things I had to look up twice.
        </p>
      </div>
    </header>

    <div class="mx-auto flex max-w-[85rem] flex-col gap-10 px-5 py-12 sm:px-8 lg:flex-row lg:gap-14 lg:px-14 lg:py-16">
      <!-- ===================== table of contents ===================== -->
      <aside class="lg:w-72 lg:shrink-0">
        <!-- mobile trigger -->
        <button
          type="button"
          class="p5-btn p5-btn--sm w-full lg:hidden"
          :aria-expanded="tocOpen"
          data-p5-hot
          @click="tocOpen = !tocOpen"
        >
          {{ tocOpen ? 'Hide' : 'Show' }} {{ table.length }} notes
        </button>

        <div
          class="mt-4 lg:mt-0 lg:sticky lg:top-8"
          :class="tocOpen ? 'block' : 'hidden lg:block'"
        >
          <p class="stamp mb-3 px-3 text-mute">— Contents</p>
          <ul class="space-y-1.5">
            <li v-for="r in table" :key="r.file">
              <button
                type="button"
                class="p5-nav-item text-left"
                :class="{ 'p5-nav-item--on': selectedMD.name === r.name }"
                :aria-current="selectedMD.name === r.name ? 'page' : undefined"
                data-p5-hot
                @click="selectedDisplayMD(r)"
              >
                <span class="flex min-w-0 items-baseline gap-3">
                  <span
                    class="p5-nav-item__label display truncate text-[1.25rem]"
                  >
                    {{ r.name }}
                  </span>
                </span>
                <span
                  class="stamp shrink-0 opacity-0 transition-opacity duration-150 [.p5-nav-item:hover_&]:opacity-100"
                  aria-hidden="true"
                >
                  ▶
                </span>
              </button>
            </li>
          </ul>

          <div class="mt-8 hidden lg:block">
            <p class="stamp mb-3 px-3 text-mute">— Colophon</p>
            <p class="px-3 text-sm leading-relaxed text-paper/55">
              Rendered with markdown-it + KaTeX. Code highlighted with
              highlight.js, recoloured to match the rest of the site.
            </p>
          </div>
        </div>
      </aside>

      <!-- ===================== article ===================== -->
      <article class="min-w-0 flex-1">
        <SectionTitle
          :title="selectedMD.name || 'Loading'"
          kicker="Currently reading"
          tone="data"
        />

        <div
          class="mt-10 transition-opacity duration-200"
          :class="loading ? 'opacity-40' : 'opacity-100'"
        >
          <div class="p5-prose prose prose-invert max-w-none" v-html="htmlOfMD"></div>
        </div>
      </article>
    </div>
  </div>
</template>
