<template>
  <v-card style="height: 100%">
    <slot></slot>
    <v-card-header style="width: 70%">
      <div v-if="subscribed">
        <v-tooltip anchor="end">
          <template v-slot:activator="{ props }">
            <span v-bind="props">
              <Transition>
                <v-icon
                  class="glow-green"
                  style="float: left"
                  size="small"
                  color="primary"
                >
                  mdi-ballot-recount
                </v-icon>
              </Transition>
            </span>
          </template>
          <span>Active</span>
        </v-tooltip>
      </div>

      <div v-else>
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <span v-bind="props">
              <v-icon style="float: left" size="small" color="error">
                mdi-alert-decagram
              </v-icon>
            </span>
          </template>
          <span>Order Subscription Inactive</span>
        </v-tooltip>
      </div>
      <div class="font-weight-bold text-h6">&nbsp;&nbsp;Active Orders</div>
    </v-card-header>
    <v-divider></v-divider>

    <v-table density="compact">
      <thead>
        <th>Instrument</th>
        <th>Type</th>
        <th>ID</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.OrderId">
          <td>{{ order.DisplayAndFormat.Description }}</td>
          <td>
            {{ order.BuySell }} {{ order.Amount }} @ {{ order.OpenOrderType }}
          </td>
          <td>{{ order.OrderId }}</td>
          <td>
            <v-icon
              size="large"
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
