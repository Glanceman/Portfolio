<template>
    <div>
        <img :src="ImagePath" class="w-12 h-12">
        <p class="text-gray-700 dark:text-gray-400 mb-4 text-center text-xs">{{Word}}</p>
    </div>

</template>

<script>
    export default{
        props:{
            ImagePath:String,
            Word:String
        }
    }
</script>