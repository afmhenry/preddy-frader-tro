<template>
  <v-text-field
    class="mx-2"
    density="compact"
    label="24-Hour Token"
    variant="outlined"
    @paste="$emit('setToken', $event.clipboardData.getData('text'))"
  >
  </v-text-field>
</template>


<script>
export default {
  name: "TokenInput",
};
</script>