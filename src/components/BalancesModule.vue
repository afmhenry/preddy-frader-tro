<template>
  <v-card height="100%">
    <slot></slot>
    <v-card-header style="width: 70%">
      <div v-if="subscribed">
        <v-tooltip anchor="end">
          <template v-slot:activator="{ props }">
            <span v-bind="props"
              ><Transition>
                <v-icon
                  class="glow-green"
                  style="float: left"
                  size="small"
                  color="primary"
                  >mdi-cash-multiple</v-icon
                ></Transition
              ></span
            >
          </template>
          <span>Balance Subscription Active</span>
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
          <span>Balance Subscription Inactive</span>
        </v-tooltip>
      </div>
      <div class="font-weight-bold text-h6">&nbsp;&nbsp;Balances due</div>
    </v-card-header>
    <div>
         Total Value: {{ balance.TotalValue }} {{balance.Currency}}
    </div>
    <div>
         Cash Balance: {{ balance.CashBalance }} {{balance.Currency}}
    </div>
  </v-card>
  <div v-if="refresh" />
</template>

<script>
import "@/assets/styles.css";

export default {
  name: "BalancesModule",
  props: ["devMode", "clientKey"],
  inject: ["openapiService"],
  data: () => ({
    subscribed: false,
    balance: {},
    refresh: false,
  }),
  beforeUpdate() {
    if (this.clientKey && !this.subscribed) {
      this.openapiService().subscribeBalances(
        this.handleBalanceMessage,
        this.clientKey
      );
      this.subscribed = true;
    }
  },

  methods: {
    handleBalanceMessage(balanceSnapshot) {
      this.balance = {
        CashBalance: balanceSnapshot.CashBalance,
        OpenOrders: balanceSnapshot.OrdersCount,
        TotalValue: balanceSnapshot.TotalValue,
        Currency: balanceSnapshot.Currency,
      };
      this.refresh = !this.refresh;

      console.log("foo", this.balance);
    },
  },
};
</script>
