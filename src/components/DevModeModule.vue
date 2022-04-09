<template>
  <v-btn
    @click="dialog = true"
    v-if="devMode"
    style="float: right;padding: 5px 5px"
    class="ma-1"
    size="medium"
  >
    <v-icon style="float: right" size="large" color="secondary"
      >mdi-information-outline</v-icon
    ></v-btn
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

<style>
.v-overlay__scrim {
  opacity: 0% !important;
}
</style>
