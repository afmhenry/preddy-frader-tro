<template>
  <v-app>
    <TopBar></TopBar>

    <v-main>
      <v-container> </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TopBar from "./components/TopBar.vue";

export default {
  name: "App",

  components: {
    TopBar,
  },

  data: () => ({
  }),
};
</script>
