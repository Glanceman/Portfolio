<template>
    <header>
        <nav id="nav" class="px-4 py-2.5">
            <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                <div href="https://flowbite.com" class="flex items-center">
                    <span class="self-center text-gray-900 dark:text-gray-200 text-4xl font-serif font-bold whitespace-nowrap">Ben</span>
                </div>
                <div class="flex items-center lg:order-2">
                    <button data-collapse-toggle="mobile-menu-2" type="button" @click="toggle"
                        class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="mobile-menu-2" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
                <div :class = "open ? 'block': 'hidden'" class="justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                    <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                        <li>
                            <router-link to="/"
                                class="block py-2 pr-4 pl-3 text-gray-700 border-gray-800 hover:text-gray-900 dark:text-gray-200 dark:border-gray-100 dark:hover:text-gray-50 lg:hover:bg-transparent lg:border-0 lg:p-0"
                                aria-current="page">
                                Home
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/about"
                            class="block py-2 pr-4 pl-3 text-gray-700 border-gray-800 hover:text-gray-900 dark:text-gray-200 dark:border-gray-100 dark:hover:text-gray-50 lg:hover:bg-transparent lg:border-0 lg:p-0"
                                aria-current="page">
                                About
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/project"
                            class="block py-2 pr-4 pl-3 text-gray-700 border-gray-800 hover:text-gray-900 dark:text-gray-200 dark:border-gray-100 dark:hover:text-gray-50 lg:hover:bg-transparent lg:border-0 lg:p-0"
                                aria-current="page">
                                Project
                            </router-link>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>


<script>


export default {
    data() {
        return {
            count: 0,
            open:false
        }
    },
    mounted() {
    },
    methods:{
        toggle(){
            this.open=!this.open
        }
    }
}
</script>

<style scoped>
#nav a.router-link-exact-active {
	@apply dark:text-white text-black font-extrabold text-lg;
}
</style>
