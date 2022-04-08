<template>
  <v-app class="fill-height">
    <TopBar
      ><DevSwitch :devMode="devMode" @click="devMode = !devMode"></DevSwitch>
      <LoginButton
        :loggedIn="loggedIn"
        @loggedIn="handleLoggedInChange"
        @clientKey="setClientKey"
    /></TopBar>

    <v-main>
      <v-container
        fluid
        style="overflow: hidden"
        class="d-flex flex-column fill-height"
      >
        <v-row style="height: 60%; max-height: 60%; min-height: 60%">
          <v-col style="width: 20%; max-width: 20%; height: 100%" class=""
            ><InstrumentModule
              @selectInstrument="selectInstrument"
              :loggedIn="loggedIn"
              ><DevModeModule
                :devMode="devMode"
                :parentModule="'InstrumentModule'"
              ></DevModeModule></InstrumentModule
          ></v-col>
          <v-col class=""
            ><ProductModule :instrumentDetails="instrumentDetails"
              ><DevModeModule
                :devMode="devMode"
                :parentModule="'ProductModule'"
              ></DevModeModule></ProductModule
          ></v-col>
          <v-col style="width: 20%; max-width: 20%; height: 100%" class=""
            ><TradeModule
              :instrumentDetails="instrumentDetails"
              :accountKeys="accountKeys"
            ></TradeModule>
          </v-col>
        </v-row>
        <v-row style="">
          <v-col class="d-flex flex-column">
            <v-row>
              <v-col
                ><OrdersModule :devMode="devMode" :clientKey="clientKey"
              /></v-col>
            </v-row>
            <v-row>
              <v-col>Positions</v-col>
            </v-row>
            <v-row style="height: 40px; max-height: 40px; min-height: 40px">
              <v-col>Account stuff</v-col>
            </v-row>
          </v-col>
          <v-col style="width: 30%; max-width: 30%"
            ><ActivityLogModule :clientKey="clientKey"
              ><DevModeModule
                :devMode="devMode"
                :parentModule="'ActivityLogModule'"
              ></DevModeModule></ActivityLogModule
          ></v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
/* eslint-disable */
import { computed } from "vue";
import InstrumentModule from "./components/InstrumentModule.vue";
import ProductModule from "./components/ProductModule.vue";
import TopBar from "./components/TopBar.vue";
import DevSwitch from "./components/DevSwitch.vue";
import TradeModule from "./components/TradeModule.vue";
import getOpenapiService from "./services/openapiService";
import LoginButton from "./components/LoginButton.vue";
import ActivityLogModule from "./components/ActivityLogModule.vue";
import DevModeModule from "./components/DevModeModule.vue";
import OrdersModule from "./components/OrdersModule.vue";

export default {
  name: "App",

  components: {
    TopBar,
    InstrumentModule,
    ProductModule,
    DevSwitch,
    TradeModule,
    LoginButton,
    ActivityLogModule,
    DevModeModule,
    OrdersModule,
  },

  data: () => ({
    environment: "sim",
    instrument: null,
    devMode: false,
    instrumentDetails: null,
    loggedIn: null,
    clientKey: null,
    accountKey: null,
    accountKeys: [],
    openapiService: null,
    clientKey: null,
  }),

  watch: {
    instrument: async function (value) {
      this.instrumentDetails = await this.openapiService().instrumentDetails(
        value.uic,
        value.assetType
      );
    },
  },

  created() {
    const { openapiService } = getOpenapiService();
    this.openapiService = openapiService;
  },

  provide() {
    return {
      openapiService: computed(() => this.openapiService),
    };
  },

  methods: {
    selectInstrument(uic, assetType) {
      this.instrument = {
        uic,
        assetType,
      };
    },
    async handleLoggedInChange(loggedIn) {
      this.loggedIn = loggedIn;
      //default instrument so we have something to look at
      this.instrument = { uic: 211, assetType: "Stock" };
      const unparsed_accounts = await this.openapiService().accountDetails();
      //default account key, advanced logic
      this.accountKey = unparsed_accounts[0]["AccountKey"];
      //support multiple accounts someplaces?
      this.accountKeys = [];
      for (var i in unparsed_accounts) {
        this.accountKeys.push(unparsed_accounts[i]["AccountKey"]);
      }
    },
    setClientKey(value) {
      this.clientKey = value;
    },
  },
};
</script>