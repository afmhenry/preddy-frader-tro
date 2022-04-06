<template>
  <v-card height="100%">
    <v-icon
      v-if="devMode"
      style="float: right"
      class="ma-1"
      size="small"
      color="secondary"
      >mdi-information-outline</v-icon
    >
    <div v-if="!instrumentDetails">
      <v-card-title>Select a instrument...</v-card-title>
      <v-divider></v-divider>
    </div>
    <div v-else>
      <v-card-header>
        <div>
          <div
            class="text-overline text-primary"
            style="font-size: 0.7rem !important; line-height: 0.8rem"
          >
            {{ instrumentDetails.Symbol }}
          </div>
          <div class="font-weight-bold text-h6">
            {{ instrumentDetails.Description }}
          </div>
        </div>
      </v-card-header>
      <v-divider></v-divider>
      <v-card-text class="text-light py-1">
        <div>
          <span>
            {{ instrumentDetails.AssetType }}
            &nbsp;&nbsp;|&nbsp;&nbsp;
          </span>
          <span v-if="instrumentDetails.Exchange.ExchangeId != 'SBFX'">
            <flag :iso="instrumentDetails.Exchange.CountryCode" />
            {{ instrumentDetails.Exchange.CountryCode }}
            ({{ instrumentDetails.CurrencyCode }}) &nbsp;&nbsp;|&nbsp;&nbsp;
          </span>
          <span v-else>
            {{ instrumentDetails.CurrencyCode }} &nbsp;&nbsp;|&nbsp;&nbsp;
          </span>
          <span>
            {{ instrumentDetails.Exchange.Name }}
          </span>
          <span style="float: right">
            {{ instrumentDetails.TradingSessions.Sessions[0].State }}
          </span>
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ProductModule",
  props: ["instrumentDetails", "devMode"],
};
</script>
