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
            <v-icon
              v-if="
                instrumentDetails.TradingSessions.Sessions[0].State ==
                'AutomatedTrading'
              "
              color="primary"
              >mdi-refresh-circle</v-icon
            >
            <v-icon
              v-else-if="
                instrumentDetails.TradingSessions.Sessions[0].State == 'Closed'
              "
              color="warning"
              >mdi-bank-off-outline</v-icon
            >
            <v-icon v-else color="orange">mdi-rhombus-outline</v-icon>
            {{
              parse_exchange_state(instrumentDetails.TradingSessions.Sessions)
            }}
          </span>
        </div>
        <div v-if="refresh"></div>
      </v-card-text>
      <div class="fill-height" id="highcharts"></div>
    </div>
  </v-card>
</template>

<script>
import Highcharts from "highcharts";

export default {
  name: "ProductModule",
  props: ["instrumentDetails", "devMode"],
  inject: ["openapiService"],
  data: () => ({
    prices: [],
    dates: [],
    refresh: false,
    chartOptions: {
      title: null,
      legend: {
        enabled: false,
      },
      yAxis: {
        title: null,
        labels: {
          style: {
            color: "#FFFFFF",
            fontSize: "12px",
          },
        },
      },
      series: [
        {
          name: "Price",
          data: [],
          color: "#6661D4",
        },
      ],
      credits: {
        enabled: false,
      },
      chart: {
        backgroundColor: "#18263bb7",
        height: "30%",
        style: {
          fontFamily: "courier",
        },
      },
    },
  }),
  beforeUpdate() {
    this.getInstrumentChart();
  },
  watch: {
    prices: function () {
      (this.chartOptions.series[0].name =
        "Price in " + this.instrumentDetails.CurrencyCode),
        (this.chartOptions.series[0].data = this.prices);
      this.chartOptions["xAxis"] = {
        type: "datetime",
        tickPixelInterval: 100,
        tickInterval: 10,
        categories: this.dates,
        labels: {
          format: "{value:%Y}",
          style: {
            color: "#FFFFFF",
            fontSize: "12px",
          },
        },
      };
      this.chartOptions.title =
        "Prices for " + this.instrumentDetails.Description;
      console.log(this.chartOptions.title);
      Highcharts.chart("highcharts", this.chartOptions);
    },
  },
  methods: {
    async getInstrumentChart() {
      if (this.instrumentDetails.Uic) {
        console.log(this.instrumentDetails);
        const response = await this.openapiService().getInstrumentChart(
          this.instrumentDetails.Uic,
          this.instrumentDetails.AssetType
        );
        var temp_prices = [];
        var temp_dates = [];
        for (var i in response.Data) {
          temp_dates.push(
            Highcharts.dateFormat(
              "%Y-%m-%d",
              new Date(response.Data[i]["Time"]).getTime()
            )
          );
          temp_prices.push(response.Data[i]["Close"]);
        }
      }
      this.prices = temp_prices;
      this.dates = temp_dates;
      this.refresh = !this.refresh;
    },
    parse_exchange_state(sessions) {
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
