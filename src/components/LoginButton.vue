<template>
  <div v-if="clientDetails">
    <v-btn variant="outlined">
      <v-icon left>mdi-account-box-outline</v-icon>

      {{ clientDetails.Name }}
    </v-btn>
    <v-btn
      flat
      class="mx-2 font-weight-regular"
      color="warning"
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
    >
      <v-icon left>mdi-account-arrow-right</v-icon>
      Login
    </v-btn>
  </div>

  <v-dialog v-model="dialog">
    <v-card>
      <v-toolbar color="primary">
        <v-card-header class="font-weight-bold text-h6">Login</v-card-header>
      </v-toolbar>
      <v-card-text>Select your environment:<br /></v-card-text>
      <v-card-actions>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="5">
            <v-btn
              width="100%"
              color="primary"
              variant="outlined"
              class="flex-grow-1"
              @click="() => login('sim')"
            >
              <v-icon left>mdi-test-tube</v-icon>
              SIM
            </v-btn>
          </v-col>
          <v-col cols="5">
            <v-tooltip anchor="top">
              <template v-slot:activator="{ props }">
                <div v-bind="props" width="50%">
                  <v-btn
                    width="100%"
                    disabled
                    color="warning"
                    title=""
                    variant="contained-text"
                    class="flex-grow-1"
                    @click="dialog = false"
                  >
                    <v-icon left>mdi-flash-outline</v-icon>
                    LIVE</v-btn
                  >
                </div>
              </template>
              <span>Live not enabled yet!</span>
            </v-tooltip></v-col
          >
          <v-col cols="1"></v-col>
        </v-row>
      </v-card-actions>

      <br />
      <v-card-text>
        If you don't have an account, get a free SIM Developer account here:
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
  emits: ["loginStatus", "clientKey", "refreshedToken"],
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
      this.$emit("loginStatus", false);
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
        this.$emit("loginStatus", true);
        removeHash();
        this.refresh();
      }
    } else {
      if (this.loggedIn) return; // We're already logged in

      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("expiresIn");
      this.$emit("loginStatus", false);
    }
  },
};
</script>
