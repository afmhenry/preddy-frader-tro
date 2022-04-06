<template>
  <v-app-bar
  image="/topbar-background.svg">
     <v-img
    class="mx-2"
    src="/saxo-icon.svg"
    max-height="50"
    max-width="50"
    contain
  ></v-img>
    <v-app-bar-title class="font-weight-bold">PreddyFraderTro</v-app-bar-title>
         <v-text-field v-model="accessToken"
            density="compact"
            label="24-Hour Token"
            variant="outlined"
          ></v-text-field>
    <!-- <v-btn color="primary">Status</v-btn> -->
    <v-btn color="light" variant="contained-text">Login</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "TopBar",
  data: () => ({
    accessToken: "Paste token here..."
  }),
};
</script>
