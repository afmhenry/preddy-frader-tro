<template>
  <v-card style="height: 100%">
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
                  >mdi-finance</v-icon
                ></Transition
              ></span
            >
          </template>
          <span>Active</span>
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
    <v-table density="compact" style="overflow: auto">
      <thead>
        <tr>
          <th class="text-left">Instrument</th>
          <th class="text-left">Amount</th>
          <th class="text-left">Position Id</th>
          <th class="text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="position in positions" :key="position.PositionId">
          <td>{{ position.DisplayAndFormat.Description }}</td>
          <td>{{ position.PositionBase.Amount }}</td>
          <td>{{ position.PositionId }}</td>
          <td>
            <v-icon
              size="large"
              color="secondary"
              @click="
                $emit(
                  'selectInstrument',
                  position.PositionBase.Uic,
                  position.PositionBase.AssetType
                )
              "
              >mdi-currency-usd</v-icon
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
  emits: ["selectInstrument"],
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
      console.log(this.positions[0], this.positions[0]);
      this.refresh = !this.refresh;
    },
  },
};
</script>
