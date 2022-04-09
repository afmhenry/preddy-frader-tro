<template>
  <Transition>
    <v-icon
      v-if="devMode"
      @click="dialog = true"
      class="glow-purple"
      style="float: right;  margin: 12px 5px"
      size="large"
      color="secondary"
      >mdi-information-outline</v-icon
    ></Transition
  >

  <v-dialog v-model="dialog">
    <v-card>
      <v-toolbar color="primary">
        <v-card-header class="font-weight-bold text-h6">
          {{ parentModule }}
        </v-card-header></v-toolbar
      >
      <v-card-text>
        <div class="text-h6 pa-12">
          Dive into how the <i>{{ parentModule }} </i> is built
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import "@/assets/custom-styles.css";

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

<style scoped>
.v-overlay__scrim {
  opacity: 0% !important;
}
</style>
