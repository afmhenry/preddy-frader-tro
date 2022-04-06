<template>
  <v-text-field
    class="mx-2"
    v-model="accessToken"
    density="compact"
    label="24-Hour Token"
    variant="outlined"
  >
  </v-text-field>
  <v-btn flat class="mx-2 font-weight-regular" color="light" variant="outlined"
    ><v-icon left>mdi-account-arrow-right</v-icon>Login</v-btn
  >
</template>

<script>
export default {
  name: "LoginButton",
  data: () => ({
    accessToken: "Paste token here...",
  }),
  watch: {
    accessToken: function (value) {
      localStorage.setItem("accessToken", value);
    },
  },
};
</script>
