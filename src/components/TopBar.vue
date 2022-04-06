<template>
  <v-app-bar image="/topbar-background.svg">
    <v-img
      class="mx-2"
      src="/saxo-icon.svg"
      max-height="60"
      max-width="60"
      contain
    ></v-img>
    <v-app-bar-title class="font-weight-bold"
      >SaxoTrader<span class="font-weight-black text-primary-darken-1"
        >DEV</span
      ></v-app-bar-title
    >
    <!-- <TokenInput /> -->
    <slot></slot>
  </v-app-bar>
</template>

<script>
// import TokenInput from "./TokenInput.vue";

export default {
  name: "TopBar",
  data: () => ({
    accessToken: "Paste token here...",
  }),
  components: {
    // TokenInput,
  },
};
</script>
