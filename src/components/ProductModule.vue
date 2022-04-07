<template>
  <v-card height="100%">
   <slot></slot>
    <div v-if="!instrumentDetails">
      <v-card-title>Select an instrument...</v-card-title>
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
              style="height: 1.4em; position: relative; top: -0.5px"
            ></i>
            {{ instrumentDetails.Exchange.CountryCode }}
            ({{ instrumentDetails.CurrencyCode }}) &nbsp;&nbsp;|&nbsp;&nbsp;
          </span>
          <span v-else>
            <i
              class="mr-1 em em-globe_with_meridians"
              style="height: 1.4em; position: relative; top: -0.5px"
            ></i>
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
                instrumentDetails.TradingSessions.Sessions[0].State ==
                'AutomatedTrading'
              "
              class="em em-zap mr-1"
              style="height: 1.4em; position: relative; top: -0.5px"
            ></i>
            <i
              v-else-if="
                instrumentDetails.TradingSessions.Sessions[0].State == 'Closed'
              "
              class="em em-first_quarter_moon_with_face mr-1"
              style="height: 1.4em; position: relative; top: -0.5px"
            ></i>
            <i
              v-else
              class="em em-small_orange_diamond mr-1"
              style="height: 1.4em; position: relative; top: -0.5px"
            ></i>
            {{
              parse_exchange_state(instrumentDetails.TradingSessions.Sessions)
            }}
          </span>
        </div>
        <!-- <div><highcharts :options="chartOptions"></highcharts></div> -->
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ProductModule",
  props: ["instrumentDetails", "devMode"],
  data: () => ({
    chartOptions: {
      title: null,
      legend: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: null,
        },
      },
      series: [
        {
          name: "Close",
          data: [
            1, 2, 3, 6, 21, 5, 89, 0, 3, 12, 45, 7, 1, 21, 6, 8, 5, 23, 4, 8, 0,
          ], // sample data
        },
      ],
      credits: {
        enabled: false,
      },
      chart: {
        height: "auto",
        style: {
          fontFamily: "courier",
        },
      },
    },
  }),
  methods: {
    parse_exchange_state(sessions) {
      //console.log(sessions);
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
