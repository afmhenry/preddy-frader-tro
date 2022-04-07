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
            <i
              :class="[
                'mr-1',
                'em',
                'em-flag-' +
                  instrumentDetails.Exchange.CountryCode.toLowerCase(),
              ]"
              style="height: 1.4em"
            ></i>
            {{ instrumentDetails.Exchange.CountryCode }}
            ({{ instrumentDetails.CurrencyCode }}) &nbsp;&nbsp;|&nbsp;&nbsp;
          </span>
          <span v-else>
            {{ instrumentDetails.CurrencyCode }} &nbsp;&nbsp;|&nbsp;&nbsp;
          </span>
          <span>
            {{ instrumentDetails.Exchange.Name }}
            <span class="text-overline" style="font-size: 0.875rem !important">
              ({{ instrumentDetails.Exchange.ExchangeId }})
            </span>
          </span>
          <span style="float: right; line-height: 2rem">
            <i
              v-if="
                instrumentDetails.TradingSessions.Sessions[0].State !=
                'AutomatedTrading'
              "
              class="em em-first_quarter_moon_with_face mr-1"
              style="height: 1.4em"
            ></i>
            <i v-else class="em em-zap mr-1" style="height: 1.4em"></i>
            {{
              parse_exchange_state(instrumentDetails.TradingSessions.Sessions)
            }}
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
  methods: {
    parse_exchange_state(sessions) {
      console.log(sessions);
      var displayText = "";
      switch (sessions[0].State) {
        case "Closed":
          displayText += "Closed";
          break;
        case "AutomatedTrading":
          displayText += "Open";
          break;
        case "PreTrading":
          displayText += "Pre-trade";
          break;
        default:
          displayText += "Closed";
      }
      const next_sessions_start = new Date(
        sessions[1].StartTime
      ).toLocaleTimeString();
      return (
        displayText +
        " (" +
        sessions[1].State +
        " at " +
        next_sessions_start +
        ")"
      );
    },
  },
};
</script>
