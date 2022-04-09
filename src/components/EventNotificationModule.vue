<template>
  <v-card height="100%">
    <slot></slot>
    <v-card-header style="width: 70%">
      <div v-if="subscribed">
        <v-tooltip anchor="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props"
              ><Transition>
                <v-icon
                  class="glow-green"
                  style="float: left"
                  size="small"
                  color="primary"
                  >mdi-apache-kafka</v-icon
                ></Transition
              ></span
            >
          </template>
          <span>Order Subscription Active</span>
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
          <span>ENS Subscription Inactive</span>
        </v-tooltip>
      </div>
      <div class="font-weight-bold text-h6">
        &nbsp;&nbsp;Event Notifications
      </div>
    </v-card-header>

    <v-list dense class="max-v-list-height" width="80%">
      <v-list-item
        v-for="message in ENSMessages"
        :key="message.id"
        two-line
        class="py-0 px-3"
        active-color="primary"
        @click="doNothing()"
      >
        <v-list-item-header>
          <v-list-item-title style="font-size: 0.8rem" class="font-weight-bold">
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
<v-btn
              style="float: right; top: 50%; bottom: 50%"
              flat
              class="mx-2 font-weight-regular"
              color="dark"
              @click="copyMessage(message.content)"
            >
              <v-icon size="small" color="secondary"
                >mdi-clipboard-text-multiple</v-icon
              ></v-btn
            >
      </v-list-item>
      
  <v-divider></v-divider>

    </v-list>
  </v-card>
</template>

<script>
import "@/assets/styles.css";

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
      this.openapiService().subscribeENS(this.handleENSMessage);
      this.subscribed = true;
    }
  },

  methods: {
    handleENSMessage(newENSMessage) {
      if (newENSMessage.messageId) {
        this.ENSMessages.unshift(this.parseENS(newENSMessage));
      }
    },
    parseENS(message) {
      var ENSType = message.payload[0].ActivityType.slice(0, -1);
      return {
        id: message.messageId,
        ENSType: ENSType,
        content: message.payload[0],
      };
    },
    async copyMessage(value) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
      } catch ($e) {
        alert("Cannot copy");
      }
    },
    doNothing(){

    }
  },
};
</script>
