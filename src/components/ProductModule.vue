<template>
  <v-card>
    <v-card-title>Instrument Details</v-card-title>
    <div v-if="!instrumentDetails">Loading...</div>
    <div v-else>
    <div>{{ uic }}</div>
    <div>{{ instrumentDetails?.Exchange?.Name }}</div>
    </div>
  </v-card>
</template>

<script>
import openapiService from '../services/openapiService'

export default {
  name: "ProductModule",
  props: ['uic', 'assetType'],
  data: () => ({
    instrumentDetails: null
  }),
  beforeUpdate() {
    this.instrumentDetails = null
    this.loadInstrumentDetails()
  },
  methods: {
    loadInstrumentDetails: async function() {
      this.instrumentDetails = await openapiService().instrumentDetails(this.uic, this.assetType)
    }
  }
};
</script>
