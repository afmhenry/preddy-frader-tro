<template>
  <div v-if="clientDetails">
    {{ clientDetails.Name }}
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
      <v-card-text> 
        Select your environment or paste in a 24h token <br>
        <TokenInput @setToken="setToken" />
      </v-card-text>
      <v-card-actions class="d-flex">
        <v-btn color="primary" class="flex-grow-1" @click="() => login('sim')"
          >SIM</v-btn
        >
        <v-btn color="primary" class="flex-grow-1" @click="dialog = false"
          >LIVE</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <iframe style="display: none" id="refreshIFrame" src=""></iframe>
</template>

<script>
import openapiService, {
  getAuthUrl,
  getLogoutUrl,
} from "../services/openapiService";
import TokenInput from './TokenInput'

function removeHash() {
  history.pushState(
    "",
    document.title,
    window.location.pathname + window.location.search
  );
}

export default {
  name: "LoginButton",
  props: ["loggedIn"],
  emits: ["loggedIn","clientKey"],
  components: { 
    TokenInput
},
  data: () => ({
    dialog: false,
    clientDetails: null,
  }),
  methods: {
    login(environment) {
      localStorage.setItem("environment", environment);
      window.location = getAuthUrl(environment);
    },
    setToken: async function(token) {
      localStorage.setItem("environment", "sim")
      localStorage.setItem("accessToken", token)
      try {
        await this.getClientDetails();
        this.dialog = false;
        this.$emit("loggedIn", true)
      } catch (e) {
        localStorage.removeItem("environment")
        localStorage.removeItem("accessToken")
        this.$emit("loggedIn", false)
      }
    },
    logout() {
      const environment = localStorage.getItem("environment");
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("expiresIn");
      this.clientDetails = null;
      this.$emit('loggedIn', false)
      window.open(getLogoutUrl(environment));
    },
    refresh() {
      console.log("refreshing...");
      const environment = localStorage.getItem("environment");
      const refreshUrl = getAuthUrl(environment, "refresh") + "&prompt=none";

      const iframe = document.getElementById("refreshIFrame");
      iframe.setAttribute("src", refreshUrl);

      const nextRefresh =
        window.localStorage.getItem("expiresIn") * 1000 - 300000;
      setTimeout(this.refresh, nextRefresh);
    },
    getClientDetails: async function () {
      this.clientDetails = await openapiService().currentClientDetails();
      this.$emit("clientKey", this.clientDetails.ClientKey)
    },
  },

  beforeUpdate() {
    if (this.loggedIn === false) {
      this.dialog = true
    }
  },

  mounted: async function () {
    // If we have a hash this is a callback after auth/refresh
    if (window.location.hash) {
      if (window.location.hash.includes("access_token")) {
        const urlParams = new URLSearchParams(
          window.location.hash.replace("#", "?")
        );
        const accessToken = urlParams.get("access_token");
        const expiresInSeconds = urlParams.get("expires_in");

        window.localStorage.setItem("accessToken", accessToken);
        window.localStorage.setItem("expiresIn", expiresInSeconds);

        if (window.location.hash.includes("refresh")) {
          // We're in the iframe, do nothing
          return;
        } else {
          // Newly logged in
          this.$emit("loggedIn", true);
          removeHash();
          this.getClientDetails();
        }
      }

      if (window.location.hash.includes("error")) {
        // Something went wrong, removing access token
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("expiresIn");
      }
    } else {
      if (window.localStorage.getItem("accessToken")) {
        // Test if it's a valid token
        try {
          await this.getClientDetails();
          this.$emit("loggedIn", true);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            window.localStorage.removeItem("accessToken");
            window.localStorage.removeItem("expiresIn");
            this.$emit("loggedIn", false);
          } else {
            throw error;
          }
        }
      } else {
        this.$emit("loggedIn", false);
      }
    }
  },
};
</script>
