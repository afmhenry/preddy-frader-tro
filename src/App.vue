<template>
  <v-app class="fill-height">
    <TopBar
      ><DevSwitch :devMode="devMode" @click="devMode = !devMode"></DevSwitch>
      <LoginButton
        :loggedIn="loggedIn"
        @loggedIn="handleLoggedInChange"
        @clientKey="setClientKey"
        @refreshedToken="handleRefreshedToken"
      />
    </TopBar>

    <v-main style="height: 100vh">
      <v-container
        fluid
        style="overflow: auto"
        class="d-flex flex-column fill-height"
        v-if="loggedIn && openapiService"
      >
        <v-row class="v-row-top">
          <v-col cols="3"
            ><InstrumentModule
              @selectInstrument="selectInstrument"
              :loggedIn="loggedIn"
              ><DevModeModule
                :devMode="devMode"
                :parentModule="'InstrumentModule'"
              ></DevModeModule></InstrumentModule
          ></v-col>
          <v-col cols="6"
            ><ProductModule :instrumentDetails="instrumentDetails"
              ><DevModeModule
                :devMode="devMode"
                :parentModule="'ProductModule'"
              /> </ProductModule
          ></v-col>
          <v-col cols="3"
            ><TradeModule
              :instrumentDetails="instrumentDetails"
              :accountKeys="accountKeys"
              ><DevModeModule :devMode="devMode" :parentModule="'TradeModule'"
            /></TradeModule>
          </v-col>
        </v-row>
        <v-row class="v-row-top">
          <v-col cols="4"
            ><PositionsModule
              :clientKey="clientKey"
              @selectInstrument="selectInstrument"
              ><DevModeModule
                :devMode="devMode"
                :parentModule="'PositionsModule'"
              ></DevModeModule></PositionsModule
          ></v-col>
          <v-col cols="4">
            <OrdersModule :clientKey="clientKey"
              ><DevModeModule
                :devMode="devMode"
                :parentModule="'OrdersModule'"
              ></DevModeModule
            ></OrdersModule>
          </v-col>
          <v-col cols="4"
            ><EventNotitficationModule :clientKey="clientKey"
              ><DevModeModule
                :devMode="devMode"
                :parentModule="'EventNotitficationModule'"
              ></DevModeModule></EventNotitficationModule
          ></v-col>
        </v-row>
        <v-row class="v-row-bot">
          <v-col cols="12"
            ><BalancesModule :clientKey="clientKey"
              ><DevModeModule
                :devMode="devMode"
                :parentModule="'BalancesModule'"
              ></DevModeModule></BalancesModule
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
import EventNotitficationModule from "./components/EventNotificationModule.vue";
import DevModeModule from "./components/DevModeModule.vue";
import OrdersModule from "./components/OrdersModule.vue";
import PositionsModule from "./components/PositionsModule.vue";
import BalancesModule from "./components/BalancesModule.vue";

export default {
  name: "App",

  components: {
    TopBar,
    InstrumentModule,
    ProductModule,
    DevSwitch,
    TradeModule,
    LoginButton,
    EventNotitficationModule,
    DevModeModule,
    OrdersModule,
    PositionsModule,
    BalancesModule,
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
      if (loggedIn) {
        // Set openapiService
        const { openapiService, reauthorizeStreaming } = getOpenapiService();
        this.openapiService = openapiService;
        this.reauthorizeStreaming = reauthorizeStreaming;

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
      } else {
        if (this.openapiService) {
          this.openapiService().teardown();
        }
      }

      this.loggedIn = loggedIn;
    },

    setClientKey(value) {
      this.clientKey = value;
    },

    handleRefreshedToken() {
      if (this.reauthorizeStreaming) {
        this.reauthorizeStreaming();
      }
    },
  },
};
</script>