<script setup>
import NavigationBar from './components/NavigationBar.vue'
import SideBar from './components/SideBar.vue'
import Footer from './components/Footer.vue'
</script>
<!-- 
  kad kreiram usera, jel ga vratim nazad
 -->
<template>
  <v-app>
    <NavigationBar/>
    <SideBar/>
    <v-main class="bg-surface-variant mt-10 ml-10 pr-10">
      <router-view/>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<style lang="scss">
  @import './styles/settings.scss';
</style>
