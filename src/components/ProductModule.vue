<template>
  <v-card>
    <v-icon
      v-if="devMode"
      style="float: right"
      class="ma-1"
      size="small"
      color="secondary"
      >mdi-information-outline</v-icon
    >
    <v-card-title>Instrument Details</v-card-title>
    <div v-if="!instrumentDetails">Loading...</div>
    <div v-else>
      <div>{{ instrumentDetails?.Uic }}</div>
      <div>{{ instrumentDetails?.Exchange?.Name }}</div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ProductModule",
  props: ["instrumentDetails", "devMode"],
};
</script>
