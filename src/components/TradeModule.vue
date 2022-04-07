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
    <v-card-header>
      <div>
        <div class="font-weight-bold text-h6">Trade</div>
        <br />

        <div v-if="!instrumentDetails">No instrument selected</div>
        <div v-else>
          <div
            class="text-overline text-primary"
            style="font-size: 0.7rem !important; line-height: 0.8rem"
          >
            {{ instrumentDetails.Symbol }}
          </div>
          <div class="font-weight-bold text-h6">
            {{ instrumentDetails.Description }}
          </div>
          <div>
            <span> Ask&nbsp;|&nbsp;{{ ask }}</span>
            <br />
            <span> Bid&nbsp;|&nbsp;{{ bid }}</span>
          </div>
        </div>
      </div>
    </v-card-header>

    <v-btn>Buy</v-btn>
    <v-btn>Sell</v-btn>
  </v-card>
</template>

<script>
import openapiService from "../services/openapiService";

export default {
  name: "TradeModule",
  props: ["instrumentDetails", "devMode"],
  data: () => ({
    instrumentPrice: null,
    ask: null,
    bid: null,
    timeDelayed: null,
  }),
  beforeUpdate() {
    this.getPrice(this.instrumentDetails.Uic, this.instrumentDetails.AssetType);
  },
  methods: {
    getPrice: async function (uic, assetType) {
      const response = await openapiService().searchInstrumentPrice(
        uic,
        assetType
      );
      this.ask = response.Quote.Ask;
      this.bid = response.Quote.Bid;
      return true
    },
  }
  };
</script>
