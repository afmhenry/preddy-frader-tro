<template>
  <v-card height="100%">
    <v-icon
      v-if="devMode"
      style="float: right"
      class="ma-1"
      size="small"
      color="secondary"
    >
      mdi-information-outline
    </v-icon>
    <v-text-field
      class="ma-2"
      v-model="keyword"
      density="compact"
      label="Instrument Search"
      variant="outlined"
      clearable
      hide-details="true"
      @focus="$event.target.select()"
    >
    </v-text-field>
    <v-divider></v-divider>
    <div style="height: 100%; overflow: auto">
      <v-list dense>
        <v-list-item
          v-for="instrument in search_result"
          :key="instrument.Identifier"
          two-line
          class="py-0 px-3"
          active-color="primary"
          @click="
            $emit(
              'selectInstrument',
              instrument.Identifier,
              instrument.AssetType
            )
          "
        >
          <v-list-item-header>
            <v-list-item-title
              style="font-size: 0.8rem"
              class="font-weight-bold"
            >
              {{ instrument.Description }}
            </v-list-item-title>
            <v-list-item-subtitle style="font-size: 0.7rem">
              <span>
                {{ instrument.Symbol }}&nbsp;-&nbsp;
                {{ instrument.CurrencyCode }}
              </span>
              &nbsp;-
              <span v-if="instrument.IssuerCountry">
                &nbsp;<flag :iso="instrument.IssuerCountry" />
              </span>
              &nbsp;({{ instrument.Identifier }})
            </v-list-item-subtitle>
          </v-list-item-header>
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>

<script>
import openapiService from "../services/openapiService";
import _ from "lodash";

export default {
  name: "InstrumentModule",
  emits: ["selectInstrument"],
  props: ["devMode"],
  data: () => ({
    keyword: "",
    search_result: [],
  }),
  watch: {
    keyword: function (value) {
      if (value) {
        this.search(value);
      } else {
        this.search_result = [];
      }
    },
  },
  methods: {
    search: _.debounce(async function (value) {
      const search_result = await openapiService().searchInstrument(value);
      const filtered = search_result.filter(function (result) {
        if (result.AssetType === "Stock") {
          return result.PrimaryListing === result.Identifier;
        } else {
          return true;
        }
      });
      this.search_result = filtered;
    }, 200),
  },
};
</script>
