<template>
  <v-text-field
    class="mx-2"
    v-model="accessToken"
    density="compact"
    label="24-Hour Token"
    variant="outlined"
  >
  </v-text-field>
</template>


<script>
export default {
  name: "TokenInput",
  data: () => ({
    accessToken: "",
  }),
  watch: {
    accessToken: function (value) {
      localStorage.setItem("accessToken", value);
      localStorage.setItem("environment", "sim");
    },
  },
};
</script>