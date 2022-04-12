<template>
  <v-btn
    flat
    class="mx-2 font-weight-regular"
    color="secondary"
    variant="outlined"
  >
    <v-icon left color="secondary">mdi-magnify-scan</v-icon>Dev Mode</v-btn
  >
</template>

<script>
export default {
  name: "DevSwitch",
  data: () => ({}),
  props: ["devMode"],
};
</script>
