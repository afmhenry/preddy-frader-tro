<template>
  <v-card height="100%">
    <slot></slot>
    <v-card-header style="width: 80%">
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
          <span>ENS Subscription Inactive</span>
        </v-tooltip>
      </div>
      <div class="font-weight-bold text-h6">
        &nbsp;&nbsp;Event Notifications
      </div>
    </v-card-header>
    <v-divider></v-divider>
    <v-container>
      <v-row>
        <v-col cols="8">
          <v-card-header-text>Messages</v-card-header-text>
          <v-list dense class="max-v-list-height">
            <v-list-item
              v-for="message in ENSMessages"
              :key="message.id"
              two-line
              class="py-0 px-3"
              active-color="warning"
              rounded="shaped"
              border= "3px"
              @click="doNothing()"
            >
              <v-row>
                <v-col cols="1" style="display: flex; align-items: center">
                  {{ message.id }}
                </v-col>
                <v-col cols="2" style="display: flex; align-items: center">
                  <v-icon size="medium" :color="message.iconColor">
                    {{ message.icon }}
                  </v-icon>
                </v-col>  
                <v-col>
                  <v-list-item-header>
                    <v-list-item-title
                      style="font-size: 0.8rem"
                      class="font-weight-bold"
                    >
                      {{ message.content.Status || "No Status" }} -
                      {{ message.ENSType }}
                    </v-list-item-title>
                    <v-list-item-subtitle style="font-size: 0.7rem">
                      <span>
                        {{ message.content?.BuySell }}
                        {{ message.content?.AssetType }}
                        {{ message.content?.Symbol }}
                        {{ message.content?.Uic }}
                        {{
                          message.content.ActivityTime.split("T")[1].split(
                            "."
                          )[0]
                        }}
                      </span>
                    </v-list-item-subtitle>
                  </v-list-item-header>
                </v-col>
                <v-col cols="3" style="display: flex; align-items: center">
                  <v-btn
                    id="message.id"
                    flat
                    class="mx-2 font-weight-regular"
                    color="dark"
                    @click="copyMessage(message.content, message.id)"
                  >
                    <v-icon size="small" color="secondary">{{
                      !clicked[message.id]
                        ? "mdi-clipboard-text-multiple"
                        : "mdi-clipboard-check-outline"
                    }}</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="4">
          <v-card-header-text>Total Recieved</v-card-header-text>
            <div v-if="Object.keys(ENSMessages).length > 0">
              <v-card-text>{{ ENSMessages[0].id }}</v-card-text>
            </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import "@/assets/custom-styles.css";

export default {
  name: "ActivityLogModule",
  props: ["devMode", "clientKey"],
  inject: ["openapiService"],
  data: () => ({
    subscribed: false,
    ENSMessages: [],
    clicked: [],
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
      var icon = "mdi-comment-text-multiple";
      var iconColor = "info";
      switch (message.payload[0].Status || null) {
        case "Cancelled":
          icon = "mdi-delete-alert";
          iconColor = "error";
          break;
        case "Modify":
          icon = "mdi-cog-transfer";
          break;
        case "Placed":
          icon = "mdi-rocket-launch";
          iconColor = "primary";
          break;
      }
      return {
        id: message.messageId,
        ENSType: ENSType,
        icon: icon,
        iconColor: iconColor,
        content: message.payload[0],
      };
    },
    async copyMessage(value, i) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
        this.clicked[i] = true;
      } catch ($e) {
        alert("Cannot copy");
      }
    },
    doNothing() {},
  },
};
</script>
