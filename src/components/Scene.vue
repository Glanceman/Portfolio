<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { getUrl } from '@/assets/tools.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const canvas = ref(null)

let renderer = null
let model = null
let raf = 0
let disposed = false

function disposeObject(root) {
  root.traverse((o) => {
    if (o.geometry) o.geometry.dispose()
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
    mats.forEach((m) => {
      Object.values(m).forEach((v) => {
        if (v && v.isTexture) v.dispose()
      })
      m.dispose()
    })
  })
}

onMounted(async () => {
  const el = canvas.value
  if (!el) return

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: el,
    alpha: true
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  camera.position.z = 12
  camera.position.y = 0

  const scene = new THREE.Scene()
  scene.add(new THREE.AmbientLight(0xffffff, 1.6))
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(-1, 2, 4)
  scene.add(light)

  let model = null
  new GLTFLoader().load(getUrl('/model/thinking_spinning/scene.gltf'), (gltf) => {
    if (disposed) {
      disposeObject(gltf.scene)
      return
    }
    model = gltf.scene
    scene.add(model)
  })

  function resize() {
    const w = el.clientWidth
    const h = el.clientHeight
    if (!w || !h) return
    // renderer owns the canvas; only push a size change when it actually changed
    if (el.width !== w || el.height !== h) {
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
  }

  function render(time) {
    if (disposed) return
    raf = requestAnimationFrame(render)
    resize()
    if (model) model.rotation.y = -time * 0.001
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(raf)
  if (model) disposeObject(model)
  renderer?.dispose()
  renderer = null
})
</script>

<template>
  <canvas ref="canvas" class="block h-full w-full"></canvas>
</template>
