<template>
  <v-btn
    @click="dialog = true"
    v-if="devMode"
    style="float: right"
    class="ma-1"
    size="medium"
  >
    <v-icon style="float: right" size="small" color="secondary"
      >mdi-information-outline</v-icon
    ></v-btn
  >

  <v-dialog v-model="dialog">
    <v-card>
      <v-card-text>
        {{ parentModule }} ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="dialog = false"
          >Close Dialog</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DevModeModule",
  props: ["devMode", "parentModule"],
  methods: {
    showDevTooltip() {
      console.log("show me");
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style></style>
