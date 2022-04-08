<template>
  <v-card height="100%">
    <v-card-header>
      <div>
        <h1>Trade</h1>
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
      <v-text-field
        class="ma-2"
        v-model="quantity"
        type="number"
        density="compact"
        label="Quantity"
        variant="outlined"
        hide-details="true"
        append-inner-icon="mdi-counter"
      ></v-text-field>

      <v-autocomplete
        class="ma-2"
        v-model="orderType"
        :items="items"
        density="compact"
        label="Order Type"
        variant="outlined"
        hide-details="true"
        append-inner-icon="mdi-axis-x-arrow"
      ></v-autocomplete>

      <v-text-field
        v-if="orderType === 'Limit'"
        class="ma-2"
        v-model="orderPrice"
        type="number"
        density="compact"
        label="Limit Price"
        variant="outlined"
        hide-details="true"
        append-inner-icon="mdi-counter"
      ></v-text-field>

      <v-container>
        <v-row>
          <v-col>
            <v-btn
              color="primary"
              :disabled="BuySellDisabled"
              @click="
                placeOrder(
                  this.instrumentDetails.Uic,
                  this.instrumentDetails.AssetType,
                  'Buy',
                  this.orderType,
                  this.orderPrice,
                  this.quantity,
                  this.accountKeys[0]
                )
              "
              >Buy</v-btn
            >
          </v-col>
          <v-col>
            <v-btn
              color="error"
              :disabled="BuySellDisabled"
              @click="
                placeOrder(
                  this.instrumentDetails.Uic,
                  this.instrumentDetails.AssetType,
                  'Sell',
                  this.orderType,
                  this.orderPrice,
                  this.quantity,
                  this.accountKeys[0]
                )
              "
              >Sell</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
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

export default {
  name: "TradeModule",
  props: ["instrumentDetails", "accountKeys"],
  inject: ["openapiService"],
  data: () => ({
    instrumentPrice: null,
    ask: null,
    bid: null,
    currency: null,
    timeDelayed: null,
    orderId: null,
    orderPrice: null,
    quantity: null,
    BuySellDisabled: true,
    orderType: "Market",
    items: ["Market", "Limit"],
  }),
  beforeUpdate() {
    this.getPrice(this.instrumentDetails.Uic, this.instrumentDetails.AssetType);
  },
  watch: {
    quantity: function (value) {
      console.log(value);
      if (value) {
        this.BuySellDisabled = false;
      } else {
        this.BuySellDisabled = true;
      }
    },
    orderType: function () {
      if (this.quantity > 0) {
        if (this.orderType === "Limit" && !this.orderPrice) {
          this.BuySellDisabled = true;
        } else {
          this.BuySellDisabled = false;
        }
      } else {
        this.BuySellDisabled = true;
      }
    },
    orderPrice: function () {
      if (this.orderPrice > 0) {
        this.BuySellDisabled = false;
      } else {
        this.BuySellDisabled = true;
      }
    },
  },
  methods: {
    getPrice: async function (uic, assetType) {
      const response = await this.openapiService().searchInstrumentPrice(
        uic,
        assetType
      );
      this.ask = response.Quote.Ask;
      this.orderPrice = this.ask;
      this.bid = response.Quote.Bid;
      this.currency = response.Quote.Currency;
    },
    placeOrder: async function (
      uic,
      assetType,
      BuyOrSell,
      MarketOrLimit,
      price,
      quantity,
      accountKey
    ) {
      const response = await this.openapiService().placeOrder(
        uic,
        assetType,
        BuyOrSell,
        MarketOrLimit,
        price,
        quantity,
        accountKey
      );
      //save order id for display
      this.orderId = response.OrderId;
    },
    prepareAnotherOrder: function () {
      this.orderId = null;
      this.quantity = null;
    },
  },
};
</script>
