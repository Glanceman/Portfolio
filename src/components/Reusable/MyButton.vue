<script setup>
defineProps({
  text: String,
  isActivate: {
    type: Boolean,
    default: false
  },
  textColor: {
    type: String,
    default: 'text-black'
  },
  activateTextColor: {
    type: String,
    default: 'text-white'
  },
  windowColor: {
    type: String,
    default: 'bg-black'
  }
})
//const isActivate = defineModel('isActivate', { default: false })
defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    :class="isActivate === true ? activateTextColor : textColor"
    class="w-full relative group inline-block px-4 py-2 hover:font-extrabold z-0"
    @click="$emit('click')"
  >
    <p class="text-center">{{ text }}</p>
    <span
      :class="
        isActivate === true
          ? 'block absolute w-[100%] h-[110%] z-[-1] animate-[myanimation_1s_linear_infinite] top-0 left-0 ' +
            windowColor
          : ' hidden'
      "
    >
    </span>
  </button>
</template>

<style scoped></style>
