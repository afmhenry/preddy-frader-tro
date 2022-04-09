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
          <span>Positions Subscription Active</span>
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
          <span>Positions Subscription Inactive</span>
        </v-tooltip>
      </div>
      <div class="font-weight-bold text-h6">&nbsp;&nbsp;Positions</div>
    </v-card-header>
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
          <th class="text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="position in positions" :key="position.PositionId">
          <td>{{ position.AccountId }}</td>
          <td>{{ position.DisplayAndFormat.Description }}</td>
          <td>{{ position.DisplayAndFormat.Symbol }}</td>
          <td>{{ position.AssetType }}</td>
          <td>{{ position.BuySell }}</td>
          <td>{{ position.Amount }}</td>
          <td>{{ position.OpenOrderType }}</td>
          <td>{{ position.Price }}</td>
          <td>{{ position.OrderId }}</td>
          <td>
                <v-icon
                  size='large'
                  color="error"
                  @click="deleteOrder(position.OrderId, position.AccountKey)"
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
  name: "PositionsModule",
  props: ["devMode", "clientKey"],
  inject: ["openapiService"],
  data: () => ({
    subscribed: false,
    positions: [],
    refresh: false,
  }),
  beforeUpdate() {
    if (this.clientKey && !this.subscribed) {
      this.openapiService().subscribePositions(
        this.handlePositionStreaming,
        this.clientKey
      );
      this.subscribed = true;
    }
  },
  methods: {
    handlePositionStreaming(positionSnapshot) {
      this.positions = positionSnapshot;
      this.refresh = !this.refresh;
    },

  },
};
</script>
