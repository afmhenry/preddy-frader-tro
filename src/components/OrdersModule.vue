<template>
  <v-card>
    WHATUP - orders to come here
    {{ orders }}
  </v-card>
</template>

<script>
export default {
  name: "OrdersModule",
  props: ["devMode", "openapiService", "clientKey"],
  data: () => ({
    subscribed: false,
    orders: [],
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
