<template>
  <v-card>
    <v-icon
      v-if="devMode"
      style="float: right"
      class="ma-1"
      size="small"
      color="secondary"
      >mdi-information-outline</v-icon
    >
    <v-card-title>Trade</v-card-title>
    <div v-if="!instrumentDetails">No instrument selected</div>
    <div v-else>
      <div>{{ uic }}</div>
      <div>{{ instrumentDetails?.Exchange?.Name }}</div>
      <v-btn>Buy</v-btn>
      <v-btn>Sell</v-btn>
    </div>
  </v-card>
</template>

<script>
import openapiService from "../services/openapiService";

export default {
  name: "TradeModule",
  props: ["instrumentDetails", "devMode"],
  methods: {
    sendOrder: async function () {
      this.instrumentDetailz = await openapiService().instrumentDetails(
        this.uic,
        this.assetType
      );
    },
  },
};
</script>
