<template>
  <Transition>
    <v-button>
      <v-icon
        v-if="devMode"
        @click="dialog = true"
        style="float: right; margin: 12px 5px"
        size="large"
        color="secondary"
        >mdi-information-outline
      </v-icon>
    </v-button>
  </Transition>

  <v-dialog v-model="dialog">
    <v-card>
      <v-toolbar color="primary">
        <v-card-header class="font-weight-bold text-h6">
          {{ content[parentModule].title }}
        </v-card-header></v-toolbar
      >
      <v-card-text>
        <div class="text pa-12">
          {{ content[parentModule].description1 }}
          <br />
          <br />
          <div
            style="background-color: #052354"
            v-for="endpoint in content[parentModule].endpoints"
            :key="endpoint"
          >
            <code style="min-width: "> {{ endpoint }}</code
            ><br />
          </div>
          <br />
          {{ content[parentModule].description2 }}
        </div>
      </v-card-text>
      <v-row>
        <v-col col="1"></v-col>
        <v-col col="3">
          <v-btn
            class="d-flex flex-column text-center"
            color="primary"
            :href="content[parentModule]['githubLink']"
            target="_blank"
          >
            The code
          </v-btn>
        </v-col>
        <v-col col="4">
          <v-btn
            class="d-flex flex-column text-center"
            color="secondary"
            :href="content[parentModule]['devLink']"
            target="_blank"
            >Developer Docs</v-btn
          >
        </v-col>
        <v-col col="3">
          <v-btn
            class="d-flex flex-column text-center"
            color="warning"
            @click="dialog = false"
            >Close</v-btn
          >
        </v-col>
        <v-col col="1"></v-col>
      </v-row>
      <br />
    </v-card>
  </v-dialog>
</template>

<script>
import "@/assets/custom-styles.css";

export default {
  name: "DevModeModule",
  props: ["devMode", "parentModule"],
  methods: {},
  data() {
    return {
      dialog: false,
      content: {
        OrdersModule: {
          title: "Orders Module",
          endpoints: ["/port/v1/orders/subscriptions", "/port/v1/orders/me"],
          description1:
            "This module references the portfolio service group, and implements \
            the streaming endpoint of the orders resource. Using minimal field groups we have a rich view.",
          description2:
            "Read more about \
            the Portfolio Balance resource in our developer documentation.",
          devLink:
            "https://www.developer.saxo/openapi/referencedocs/port/v1/orders",
          githubLink:
            "https://github.com/afmhenry/preddy-frader-tro/blob/b141092cb8d40aec6ad9ac1eef7ee26e8112e521/src/services/openapiService.js#L184",
        },
        BalancesModule: {
          title: "Balances Module",
          endpoints: [
            "/port/v1/balances/subscriptions",
            "/port/v1/balances/me",
          ],
          description1:
            "This module references the portfolio orders endpoint, and implements \
            the streaming endpoint of the balances resource. ",
          description2:
            "Read more about \
            the portfolio order resource in our developer documentation.",
          devLink:
            "https://www.developer.saxo/openapi/referencedocs/port/v1/balances",
          githubLink:
            "https://github.com/afmhenry/preddy-frader-tro/blob/b141092cb8d40aec6ad9ac1eef7ee26e8112e521/src/services/openapiService.js#L184",
        },
      },
    };
  },
};
</script>

<!--this, if not scoped, will affect the login page. Not sure if ok?-->
<style scoped>
.v-overlay__scrim {
  opacity: 0% !important;
}
</style>
