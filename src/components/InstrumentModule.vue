<template>
  <v-card>
    <v-card-title>Search</v-card-title>
    <v-text-field
      class="mx-2"
      v-model="keyword"
      density="compact"
      label="Instrument Search"
      variant="outlined"
    >
    </v-text-field>
    <v-card class="d-flex" @click="$emit('selectInstrument', instrument.Identifier, instrument.AssetType)" v-for="instrument in instruments" :key="instrument.Identifier">
      <div>{{ instrument.Description }}</div>
      <div>{{ instrument.Symbol }}</div>
      <div>{{ instrument.Identifier }}</div>
    </v-card>
  </v-card>
</template>

<script>
import openapiService from '../services/openapiService'
import _ from 'lodash'

export default {
  name: "InstrumentModule",
  emits: ['selectInstrument'],
  data: () => ({
    keyword: "",
    instruments: []
  }),
  watch: {
    keyword: function (value) {
      console.log(value);
      this.search(value)
    }
  },
  methods: {
    search: _.debounce(async function(value) { 
        this.instruments = await openapiService().searchInstrument(value)
      }, 200)
  }
};
</script>
