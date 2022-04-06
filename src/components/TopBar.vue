<template>
  <v-app-bar>
    <v-app-bar-title> PreddyFraderTro </v-app-bar-title>
         <v-text-field v-model="accessToken"
            density="compact"
            label="24 Hour Token"
            variant="outlined"
          ></v-text-field>
    <v-btn color="primary">Status</v-btn>
    <v-btn color="secondary">Login</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "TopBar",
  data: () => ({
    accessToken: "foo"
  }),
};
</script>
