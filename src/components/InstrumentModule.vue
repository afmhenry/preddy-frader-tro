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
