<template>
  <v-card>
    <div><slot></slot></div>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Account</th>
          <th class="text-left">Instrument</th>
          <th class="text-left">Ticker</th>
          <th class="text-left">Type</th>
          <th class="text-left">Buy/Sell</th>
          <th class="text-left">Amount</th>
          <th class="text-left">Order Type</th>
          <th class="text-left">Price</th>
          <th class="text-left">ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.OrderId">
          <td>{{ order.AccountId }}</td>
          <td>{{ order.DisplayAndFormat.Description }}</td>
          <td>{{ order.DisplayAndFormat.Symbol }}</td>
          <td>{{ order.AssetType }}</td>
          <td>{{ order.BuySell }}</td>
          <td>{{ order.Amount }}</td>
          <td>{{ order.OpenOrderType }}</td>
          <td>{{ order.Price }}</td>
          <td>{{ order.OrderId }}</td>
          <td>
            <v-btn
              color="secondary"
              height="50%"
              width="70px"
              @click="deleteOrder(order.OrderId, order.AccountKey)"
              >Cancel</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script>
export default {
  name: "OrdersModule",
  props: ["devMode", "clientKey"],
  inject: ["openapiService"],
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
    },
    deleteOrder: async function (accountKey, orderId) {
      await this.openapiService().deleteOrder(accountKey, orderId);
    },
  },
};
</script>
