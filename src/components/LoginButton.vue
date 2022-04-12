<template>
  <div v-if="clientDetails">
    <v-btn variant="outlined">
      <i
        class="em em-bust_in_silhouette mr-1"
        style="height: 1.4em; position: relative; top: -0.5px"
      >
      </i>
      {{ clientDetails.Name }}
    </v-btn>
    <v-btn
      flat
      class="mx-2 font-weight-regular"
      color="light"
      variant="outlined"
      @click="logout"
      ><v-icon left>mdi-account-arrow-right</v-icon>Logout</v-btn
    >
  </div>
  <div v-else>
    <v-btn
      flat
      class="mx-2 font-weight-regular"
      color="light"
      variant="outlined"
      @click="dialog = true"
      ><v-icon left>mdi-account-arrow-right</v-icon>Login</v-btn
    >
  </div>

  <v-dialog v-model="dialog">
    <v-card>
      <v-toolbar color="primary">
        <v-card-header class="font-weight-bold text-h6"> Login </v-card-header>
      </v-toolbar>
      <v-card-text> Select your environment <br /> </v-card-text>
      <v-card-actions class="d-flex">
        <v-btn
          color="primary"
          variant="outlined"
          class="flex-grow-1"
          @click="() => login('sim')"
        >
          <i
            class="em em-dna mr-1"
            style="height: 1.4em; position: relative; top: -0.5px"
          >
          </i>
          SIM
        </v-btn>
        <v-btn
          color="warning"
          variant="outlined"
          class="flex-grow-1"
          @click="dialog = false"
        >
          <i
            class="em em-zap mr-1"
            style="height: 1.4em; position: relative; top: -0.5px"
          >
          </i
          >LIVE</v-btn
        >
      </v-card-actions>

      <br />
      <v-card-text>
        If you don't have an account, get one for free:
        <a target="_blank" href="https://www.developer.saxo/accounts/sim/signup"
          >Developer Account</a
        >
        <br />
      </v-card-text>
    </v-card>
  </v-dialog>
  <iframe style="display: none" id="refreshIFrame" src=""></iframe>
</template>

<script>
import { getAuthUrl, getLogoutUrl } from "../services/openapiService";

function removeHash() {
  history.pushState(
    "",
    document.title,
    window.location.pathname + window.location.search
  );
}

function parseAndStoreAccessToken(hash) {
  const urlParams = new URLSearchParams(hash.replace("#", "?"));
  const accessToken = urlParams.get("access_token");
  const expiresInSeconds = urlParams.get("expires_in");

  window.localStorage.setItem("accessToken", accessToken);
  window.localStorage.setItem("expiresIn", expiresInSeconds);
}

export default {
  name: "LoginButton",
  props: ["loggedIn"],
  emits: ["loggedIn", "clientKey", "refreshedToken"],
  inject: ["openapiService"],
  data: () => ({
    dialog: false,
    clientDetails: null,
    iframe: null,
  }),
  methods: {
    login(environment) {
      localStorage.setItem("environment", environment);
      window.location = getAuthUrl(environment);
    },
    logout() {
      const environment = localStorage.getItem("environment");
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("expiresIn");
      this.clientDetails = null;
      this.$emit("loggedIn", false);
      window.open(getLogoutUrl(environment));
    },
    refresh() {
      console.log("refreshing...");
      const environment = localStorage.getItem("environment");
      const refreshUrl = getAuthUrl(environment, "refresh") + "&prompt=none";

      this.iframe.setAttribute("src", refreshUrl);

      const nextRefresh =
        window.localStorage.getItem("expiresIn") * 1000 - 300000;
      setTimeout(this.refresh, nextRefresh);
    },
    getClientDetails: async function () {
      this.clientDetails = await this.openapiService().currentClientDetails();
      this.$emit("clientKey", this.clientDetails.ClientKey);
    },
  },

  beforeUpdate() {
    if (this.loggedIn === false) {
      this.dialog = true;
    }

    if (this.loggedIn && !this.clientDetails) {
      this.getClientDetails();
    }
  },

  mounted: async function () {
    // Add refresh handler to iframe
    this.iframe = document.getElementById("refreshIFrame");

    const emit = this.$emit;

    this.iframe.addEventListener("load", function (e) {
      const hash = e.target.contentWindow.location.hash;

      if (hash.includes("access_token")) {
        parseAndStoreAccessToken(hash);
      }

      emit("refreshedToken");
    });

    // If we have a hash this is a callback after auth/refresh
    if (window.location.hash) {
      if (window.location.hash.includes("error")) {
        // Something went wrong, removing access token
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("expiresIn");
        return;
      }

      if (window.location.hash.includes("access_token")) {
        parseAndStoreAccessToken(window.location.hash);
        this.$emit("loggedIn", true);
        removeHash();
        this.refresh();
      }
    } else {
      if (this.loggedIn) return; // We're already logged in

      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("expiresIn");
      this.$emit("loggedIn", false);
    }
  },
};
</script>
