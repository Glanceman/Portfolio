<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { getUrl } from '@/assets/tools.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
const canvas = ref(null)

function resizeRendererToDisplaySize(renderer, canvas) {
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

onMounted(async () => {
  let width = 100
  let height = 100
  let model = null
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas.value,
    alpha: true
  })
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.value.width / canvas.value.height,
    0.1,
    1000
  )
  camera.position.z = 12
  camera.position.y = 0

  const scene = new THREE.Scene()

  const gltfLoader = new GLTFLoader()
  const url = getUrl('/model/thinking_spinning/scene.gltf')
  console.log(url)
  gltfLoader.load(url, (gltf) => {
    const root = gltf.scene
    model = root
    scene.add(root)
  })

  //   const geometry = new THREE.BoxGeometry(1, 1, 1)
  //   const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 })
  //   const cube = new THREE.Mesh(geometry, material)
  //   scene.add(cube)

  const color = 0xffffff
  const intensity = 3
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(-1, 2, 4)
  scene.add(light)

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  function render(time) {
    time *= 0.001 // convert time to seconds
    // cube.rotation.x = time
    // cube.rotation.y = time
    if (model != null) {
      model.rotation.y = -time
    }
    if (canvas != null && camera != null) {
      if (resizeRendererToDisplaySize(renderer, canvas)) {
        camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight
        camera.updateProjectionMatrix()
      }
    }

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
})
</script>

<template>
  <canvas class="w-full h-full" ref="canvas"></canvas>
</template>
