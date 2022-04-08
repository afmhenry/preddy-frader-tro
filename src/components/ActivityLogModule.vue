<template>
  <v-card height="100%">
    <slot></slot>
    <v-card-header style="width: 70%">
      <div v-if="subscribed">
        <v-tooltip top>
          <template v-slot:activator="{ props }">
            <span v-bind="props"
              ><v-icon style="float: left" size="small" color="primary"
                >mdi-apache-kafka</v-icon
              ></span
            >
          </template>
          <span>ENS Connection Active</span>
        </v-tooltip>
      </div>

      <div v-else>
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <span v-bind="props"
              ><v-icon style="float: left" size="small" color="error"
                >mdi-alert-decagram</v-icon
              ></span
            >
          </template>
          <span style="opacity: 0%">ENS Inactive</span>
        </v-tooltip>
      </div>
      <div class="font-weight-bold text-h6">&nbsp;&nbsp;&nbsp;Activity Log</div>
    </v-card-header>

    <v-card-text v-if="subscribed && ENSMessages.length > 0">
      <v-list dense>
        <v-list-item
          v-for="message in ENSMessages"
          :key="message.id"
          two-line
          class="py-0 px-3"
          active-color="secondary"
          @click="copyURL(message.content)"
        >
          <v-list-item-header>
            <v-list-item-title
              style="font-size: 0.8rem"
              class="font-weight-bold"
            >
              {{ message.id }} - {{ message.content.Status }} -
              {{ message.ENSType }}
            </v-list-item-title>
            <v-list-item-subtitle style="font-size: 0.7rem">
              <span>
                {{ message.content?.BuySell }}
                {{ message.content?.AssetType }}
                {{ message.content?.Symbol }}
                {{ message.content?.Uic }}
                {{ message.content.ActivityTime.split("T")[1].split(".")[0] }}
              </span>
            </v-list-item-subtitle>
          </v-list-item-header>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ActivityLogModule",
  props: ["devMode", "clientKey"],
  inject: ["openapiService"],
  data: () => ({
    subscribed: false,
    ENSMessages: [],
  }),
  beforeUpdate() {
    if (this.clientKey && !this.subscribed) {
      this.openapiService().subscribeENS(this.handleNewENS);
      this.subscribed = true;
    }
  },
  methods: {
    handleNewENS(newENSMessage) {
      if (newENSMessage.messageId) {
        this.ENSMessages.unshift(this.parseENS(newENSMessage));
      }
    },
    parseENS(message) {
      console.log(message);
      var ENSType = message.payload[0].ActivityType.slice(0, -1);
      return {
        id: message.messageId,
        ENSType: ENSType,
        content: message.payload[0],
      };
    },
    async copyURL(value) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(value));
      } catch ($e) {
        alert("Cannot copy");
      }
    },
  },
};
</script>