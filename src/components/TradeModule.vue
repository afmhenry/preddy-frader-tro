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
          <div v-if="ask">
            <span>
              Ask&nbsp;|&nbsp;{{ ask }}&nbsp;{{
                instrumentDetails.CurrencyCode
              }}</span
            >
            <br />
            <span>
              Bid&nbsp;|&nbsp;{{ bid }} &nbsp;{{
                instrumentDetails.CurrencyCode
              }}</span
            >
          </div>
        </div>
      </div>
    </v-card-header>
    <v-card-text v-if="!orderId">
      <v-row>
        <v-text-field
          class="ma-2"
          style="width: 30%"
          v-model="amount"
          type="number"
          density="compact"
          label="Quantity"
          variant="outlined"
          hide-details="true"
          append-inner-icon="mdi-counter"
        ></v-text-field>
      </v-row>
      <v-row>
        <v-col
          ><v-btn
            color="primary"
            @click="
              marketOrder(
                this.instrumentDetails.Uic,
                this.instrumentDetails.AssetType,
                'Buy',
                this.amount
              )
            "
            >Buy</v-btn
          ></v-col
        >
        <v-col>
          <v-btn
            color="error"
            @click="
              marketOrder(
                this.instrumentDetails.Uic,
                this.instrumentDetails.AssetType,
                'Sell',
                this.amount
              )
            "
            >Sell</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else>
      Your order {{ orderId }} has been placed.
      <v-btn color="secondary" @click="prepareAnotherOrder()"
        >Place Another Order</v-btn
      >
    </v-card-text>
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
    currency: null,
    timeDelayed: null,
    orderId: null,
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
      this.currency = response.Quote.Currency;
    },
    marketOrder: async function (uic, assetType, BuyOrSell, amount) {
      const response = await openapiService().placeMarketOrder(
        uic,
        assetType,
        BuyOrSell,
        amount
      );
      console.log(response);
      this.orderId = response.OrderId;
    },
    prepareAnotherOrder: function () {
      this.orderId = null;
      this.amount = null;
    },
  },
};
</script>
