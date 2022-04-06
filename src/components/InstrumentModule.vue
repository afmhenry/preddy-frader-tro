<template>
  <v-card>
    <h1>Instruments</h1>
    <v-text-field
      class="mx-2"
      v-model="keyword"
      density="compact"
      label="Instrument"
      variant="outlined"
      placeholder="Search..."
    >
    </v-text-field>
  </v-card>
</template>

<script>
export default {
  name: "InstrumentModule",
  data: () => ({
    keyword: "",
  }),
  watch: {
    keyword: function (value) {
      console.log(value);
      
    },
  },
};
</script>
