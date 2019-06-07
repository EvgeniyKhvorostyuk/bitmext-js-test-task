<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title>BitMEX Testnet</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container>
        <dashboard></dashboard>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'app',
  components: {
    Dashboard
  }
}
</script>

<style lang="scss">
@import '@/sass/app.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
