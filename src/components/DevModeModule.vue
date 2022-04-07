<template>
  <v-icon
    @click="showDevTooltip()"
    v-if="devMode"
    style="float: right"
    class="ma-1"
    size="small"
    color="secondary"
    >mdi-information-outline</v-icon
  >
</template>

<script>
export default {
  name: "DevModeModule",
  props: ["devMode"],
  methods: {
    showDevTooltip() {
      console.log("show me");
    },
  },
};
</script>

<style></style>
