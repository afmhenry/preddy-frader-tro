<template>
  <v-app class="fill-height">
    <TopBar
      ><DevSwitch :devMode="devMode" @click="devMode = !devMode"></DevSwitch
    ></TopBar>

    <v-main class="fill-height">
      <v-container fluid class="d-flex flex-column fill-height">
        <v-row style="height: 60%; max-height: 60%; min-height: 60%">
          <v-col style="width: 20%; max-width: 20%" class="pa-1"
            ><InstrumentModule
              @selectInstrument="selectInstrument"
              :devMode="devMode"
          /></v-col>
          <v-col class="pa-1"
            ><ProductModule
              :instrumentDetails="instrumentDetails"
              :devMode="devMode"
          /></v-col>
          <v-col style="width: 20%; max-width: 20%" class="pa-1"
            ><TradeModule
              :instrumentDetails="instrumentDetails"
              :devMode="devMode"
            />
          </v-col>
        </v-row>
        <v-row style="">
          <v-col class="d-flex flex-column">
            <v-row>
              <v-col>ORDERS</v-col>
            </v-row>
            <v-row>
              <v-col>Positions</v-col>
            </v-row>
            <v-row style="height: 40px; max-height: 40px; min-height: 40px">
              <v-col>Account stuff</v-col>
            </v-row>
          </v-col>
          <v-col style="width: 30%; max-width: 30%">Events</v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import InstrumentModule from "./components/InstrumentModule.vue";
import ProductModule from "./components/ProductModule.vue";
import TopBar from "./components/TopBar.vue";
import DevSwitch from "./components/DevSwitch.vue";
import TradeModule from "./components/TradeModule.vue";
import openapiService from "./services/openapiService";

export default {
  name: "App",

  components: {
    TopBar,
    InstrumentModule,
    ProductModule,
    DevSwitch,
    TradeModule,
  },

  data: () => ({
    environment: "sim",
    instrument: null,
    devMode: false,
    instrumentDetails: null,
  }),
  watch: {
    instrument: async function (value) {
      console.log(value.uic, value.assetType);
      this.instrumentDetails = await openapiService().instrumentDetails(
        value.uic,
        value.assetType
      );
      console.log(this);
    },
  },
  methods: {
    selectInstrument(uic, assetType) {
      this.instrument = {
        uic,
        assetType,
      };
    },
  },
};
</script>
