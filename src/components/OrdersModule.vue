<template>
  <v-card>
    WHATUP - orders to come here
    {{ orders }}
  </v-card>
</template>

<script>
export default {
  name: "OrdersModule",
  props: ["devMode", "openapiService"],
  data: () => ({
    orders: [],
  }),
  mounted() {
    this.openapiService().subscribeOrders(this.handleNewOrders);
  },
  methods: {
    handleNewOrders(newOrders) {
      this.orders = newOrders;
      console.log(newOrders);
    },
  },
};
</script>
