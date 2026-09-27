<script setup>
/**
 * The slow layer.
 *
 * In Persona 5 the background never stops moving, but it always moves *slower*
 * than the interface — that contrast is what makes the UI feel urgent. So
 * everything in here runs on a 18-40s loop, an order of magnitude lazier than
 * the ~0.6s hover loops on the actual controls.
 */
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden="true">
    <!-- deep paper wash so pure black never sits flat -->
    <div
      class="absolute -top-[30vh] -left-[20vw] h-[85vh] w-[75vw] bg-paper opacity-[0.035] blur-[90px] animate-[p5-drift-a_38s_ease-in-out_infinite]"
    ></div>
    <div
      class="absolute -bottom-[35vh] -right-[15vw] h-[80vh] w-[70vw] bg-accent opacity-[0.05] blur-[110px] animate-[p5-drift-b_31s_ease-in-out_infinite]"
    ></div>

    <!-- sheared accent slab, far top-right -->
    <div
      class="absolute -top-24 right-[-6rem] h-[46rem] w-[16rem] bg-accent opacity-[0.07] slant-lg animate-[p5-drift-a_44s_ease-in-out_infinite]"
    ></div>

    <!-- sheared data slab, low left -->
    <div
      class="absolute bottom-[-8rem] left-[-5rem] h-[34rem] w-[11rem] bg-data opacity-[0.06] slant-lg animate-[p5-drift-b_27s_ease-in-out_infinite]"
    ></div>

    <!-- halftone dot field, breathing -->
    <div
      class="halftone-lg absolute inset-0 text-paper opacity-[0.055] animate-[p5-dots_19s_ease-in-out_infinite]"
    ></div>

    <!-- comic hatching in two corners -->
    <div
      class="hatch-fat absolute -left-16 top-1/3 h-64 w-[120%] text-paper opacity-[0.045] -rotate-12 animate-[p5-drift-a_33s_ease-in-out_infinite]"
    ></div>
    <div
      class="hatch absolute -right-16 bottom-1/4 h-52 w-[120%] text-accent opacity-[0.05] rotate-[18deg] animate-[p5-drift-b_24s_ease-in-out_infinite]"
    ></div>

    <!-- print grain -->
    <div class="grain absolute inset-0"></div>

    <!-- keeps the edges from glowing -->
    <div
      class="absolute inset-0"
      style="
        background:
          radial-gradient(120% 80% at 50% 0%, transparent 40%, rgba(0, 0, 0, 0.55) 100%),
          linear-gradient(180deg, transparent 70%, rgba(0, 0, 0, 0.6) 100%);
      "
    ></div>
  </div>
</template>
