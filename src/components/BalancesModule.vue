<template>
  <v-card height="100%">
    <slot></slot>
    <v-row>
      <v-col cols="2">
        <v-card-header>
          <div v-if="subscribed">
            <v-tooltip anchor="end">
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <Transition>
                    <v-icon
                      class="glow-green mr-3"
                      style="float: right"
                      size="small"
                      color="primary"
                    >
                      mdi-cash-multiple
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
                  <v-icon
                    style="float: left"
                    size="small"
                    color="error"
                    class="mr-3"
                  >
                    mdi-alert-decagram
                  </v-icon>
                </span>
              </template>
              <span>Balance Subscription Inactive</span>
            </v-tooltip>
          </div>
          <div class="font-weight-bold text-h6">&nbsp;&nbsp;Account Value</div>
        </v-card-header>
      </v-col>
      <v-col cols="2">
        <v-card class="mt-3">
          <v-card-header>
            <div
              class="text-overline text-primary"
              style="font-size: 0.7rem !important; line-height: 0.8rem"
            >
              Account Value
            </div>
          </v-card-header>
          <v-card-text>
            <div class="font-weight-bold text-h6">
              {{ balance.TotalValue }}
              <span class="text-overline">{{ balance.Currency }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mt-3">
          <v-card-header>
            <div
              class="text-overline text-primary"
              style="font-size: 0.7rem !important; line-height: 0.8rem"
            >
              Cash
            </div>
          </v-card-header>
          <v-card-text>
            <div class="font-weight-bold text-h6">
              {{ balance.CashBalance }}
              <span class="text-overline">{{ balance.Currency }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mt-3">
          <v-card-header>
            <div
              class="text-overline text-primary"
              style="font-size: 0.7rem !important; line-height: 0.8rem"
            >
              Positions Value
            </div>
          </v-card-header>
          <v-card-text>
            <div class="font-weight-bold text-h6">
              {{ balance.NonMarginPositionsValue }}
              <span class="text-overline">{{ balance.Currency }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card class="mt-3">
          <v-card-header>
            <div
              class="text-overline text-primary"
              style="font-size: 0.7rem !important; line-height: 0.8rem"
            >
              Margin Usage
            </div>
          </v-card-header>
          <v-card-text>
            <div class="font-weight-bold text-h6">
              {{ balance.MarginUtilizationPct }}
              <span class="text-overline">%</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="1">
        <v-card class="mt-3">
          <v-card-header>
            <div
              class="text-overline text-primary"
              style="font-size: 0.7rem !important; line-height: 0.8rem"
            >
              Orders
            </div>
          </v-card-header>
          <v-card-text>
            <div class="font-weight-bold text-h6">
              {{ balance.OrdersCount }}
              <span class="text-overline">#</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="1">
        <v-card class="mt-3">
          <v-card-header>
            <div
              class="text-overline text-primary"
              style="font-size: 0.7rem !important; line-height: 0.8rem"
            >
              Positions
            </div>
          </v-card-header>
          <v-card-text>
            <div class="font-weight-bold text-h6">
              {{ balance.OpenPositionsCount }}
              <span class="text-overline">#</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
  <div v-if="refresh" />
</template>

<script>
import "@/assets/custom-styles.css";

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
        OrdersCount: balanceSnapshot.OrdersCount,
        OpenPositionsCount: balanceSnapshot.OpenPositionsCount,
        TotalValue: balanceSnapshot.TotalValue,
        Currency: balanceSnapshot.Currency,
        MarginUtilizationPct: balanceSnapshot.MarginUtilizationPct,
        NonMarginPositionsValue: balanceSnapshot.NonMarginPositionsValue,
      };
      this.refresh = !this.refresh;
    },
  },
};
</script>
