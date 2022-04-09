<template>
  <v-card>
    <slot></slot>
    <v-card-header style="width: 70%">
      <div v-if="subscribed">
        <v-tooltip anchor="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props"
              ><Transition>
                <v-icon
                  class="glow-green"
                  style="float: left"
                  size="small"
                  color="primary"
                  >mdi-ballot-recount</v-icon
                ></Transition
              ></span
            >
          </template>
          <span>Order Subscription Active</span>
        </v-tooltip>
      </div>

      <div v-else>
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <span v-bind="props"
              ><v-icon style="float: left" size="small" color="error"
                >mdi-alert-decagram
              </v-icon></span
            >
          </template>
          <span>ENS Subscription Inactive</span>
        </v-tooltip>
      </div>
      <div class="font-weight-bold text-h6">&nbsp;&nbsp;Active Orders</div>
    </v-card-header>
    <v-table density="compact" class="max-v-list-height">
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
          <th class="text-left"></th>
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
                <v-icon
                  size='large'
                  color="error"
                  @click="deleteOrder(order.OrderId, order.AccountKey)"
                  >mdi-close-circle-outline</v-icon
                >
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
  <div v-if="refresh" />
</template>

<script>
import "@/assets/custom-styles.css";

export default {
  name: "OrdersModule",
  props: ["devMode", "clientKey"],
  inject: ["openapiService"],
  data: () => ({
    subscribed: false,
    orders: [],
    refresh: false,
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
      this.refresh = !this.refresh;
    },
    deleteOrder: async function (accountKey, orderId) {
      await this.openapiService().deleteOrder(accountKey, orderId);
    },
  },
};
</script>
