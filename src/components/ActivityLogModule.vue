<template>
  <v-card height="100%">
    <slot></slot>
    <v-card-header>
      <div>
        <div class="font-weight-bold text-h6">Activity Log</div>
        <br />

        <div v-if="!subscriptionActive">
          <div
            class="text-overline text-error font-weight-bold"
            style="font-size: 0.7rem !important; line-height: 0.8rem"
          >
            No ENS Subscription Active
          </div>
        </div>
        <div v-else>
          <div
            class="text-overline text-primary"
            style="font-size: 0.7rem !important; line-height: 0.8rem"
          >
            ENS Subscription Active
          </div>
        </div>
      </div>
    </v-card-header>
    <v-card-text v-if="subscriptionActive"> </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: "ActivityLogModule",
  props: ["devMode"],
  inject: ["openapiService"],

  data: () => ({
    subscriptionActive: true,
  }),
  beforeUpdate() {
    if (this.clientKey && !this.subscribed) {
      this.openapiService().subscribeOrders(
        this.handleNewOrders,
        this.clientKey
      );
      this.subscribed = true;
    }
  },
  methods: {
    handleNewOrders(newOrders) {
      this.orders = newOrders;
      console.log(newOrders);
    },
  },
};
</script>