<template>
  <v-app class="fill-height">
    <TopBar
      ><DevSwitch :devMode="devMode" @click="devMode = !devMode"></DevSwitch>
      <LoginButton :loggedIn="loggedIn" @loggedIn="handleLoggedInChange"
    /></TopBar>

    <v-main class="fill-height">
      <v-container
        fluid
        style="overflow: hidden"
        class="d-flex flex-column fill-height"
      >
        <v-row style="height: 60%; max-height: 60%; min-height: 60%">
          <v-col style="width: 20%; max-width: 20%; height: 100%" class=""
            ><InstrumentModule
              @selectInstrument="selectInstrument"
              :devMode="devMode"
              :loggedIn="loggedIn"
          /></v-col>
          <v-col class=""
            ><ProductModule
              :instrumentDetails="instrumentDetails"
              :devMode="devMode"
          /></v-col>
          <v-col style="width: 20%; max-width: 20%" class=""
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
import LoginButton from "./components/LoginButton.vue";

export default {
  name: "App",

  components: {
    TopBar,
    InstrumentModule,
    ProductModule,
    DevSwitch,
    TradeModule,
    LoginButton,
  },

  data: () => ({
    environment: "sim",
    instrument: null,
    devMode: false,
    instrumentDetails: null,
    loggedIn: null,
  }),

  watch: {
    instrument: async function (value) {
      this.instrumentDetails = await openapiService().instrumentDetails(
        value.uic,
        value.assetType
      );
    },
  },

  methods: {
    selectInstrument(uic, assetType) {
      this.instrument = {
        uic,
        assetType,
      };
    },
    handleLoggedInChange(loggedIn) {
      this.loggedIn = loggedIn;
    },
  },
};
</script>
