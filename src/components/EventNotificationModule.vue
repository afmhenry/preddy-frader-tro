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
      <div class="font-weight-bold text-h6">&nbsp;&nbsp;Events</div>
    </v-card-header>
    <v-divider></v-divider>
    <v-container>
      <v-row>
        <v-col>
          <v-list dense class="max-v-list-height-ens">
            <v-list-item
              v-for="message in ENSMessages"
              :key="message.id"
              two-line
              class="py-0 px-3"
              rounded="xl"
              border="3px"
              @click="copyMessage(message.content, message.id)"
            >
              <v-row>
                <v-col
                  cols="1"
                  style="display: flex; align-items: center"
                  class="ml-3"
                >
                  {{ message.id }}
                </v-col>
                <v-col cols="1" style="display: flex; align-items: center">
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
                      {{
                        message.content.Status ||
                        "Filled: " + message.content.FillAmount
                      }}
                      - {{ message.ENSType }} - {{ message.content?.Symbol }}
                    </v-list-item-title>
                    <v-list-item-subtitle style="font-size: 0.7rem">
                      <span>
                        {{ message.content?.BuySell }}
                        {{ message.content?.AssetType }}
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
                <v-col cols="1" style="display: flex; align-items: center">
                  <v-icon
                    size="small"
                    :color="!clicked[message.id] ? 'light' : 'primary'"
                    >{{
                      !clicked[message.id]
                        ? "mdi-clipboard-text-multiple"
                        : "mdi-clipboard-check-outline"
                    }}</v-icon
                  >
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <div v-if="refresh"></div>
</template>

<script>
import "@/assets/custom-styles.css";

export default {
  name: "ActivityLogModule",
  props: ["clientKey", "loggedIn"],
  inject: ["openapiService"],
  data: () => ({
    subscribed: false,
    refresh: false,
    ENSMessages: [],
    clicked: [],
    beats: 0,
  }),
  beforeUpdate() {
    if (this.clientKey && !this.subscribed && this.loggedIn) {
      this.openapiService().subscribeENS(this.handleENSMessage);
      this.subscribed = true;
    } else {
      this.subscribed = false;
      this.refresh = !this.refresh;
    }
  },

  methods: {
    handleENSMessage(newENSMessage, heartbeat) {
      if (heartbeat) {
        this.beats += 1;
      } else if (newENSMessage[0]) {
        this.ENSMessages.unshift(this.parseENS(newENSMessage.pop()));
      }
    },
    parseENS(message) {
      var ENSType = message.payload[0].ActivityType.slice(0, -1);
      var icon = "mdi-comment-text-multiple";
      var iconColor = "info";
      switch (message.payload[0].Status || null) {
        case "Cancelled":
          icon = "mdi-delete-alert";
          iconColor = "warning";
          break;
        case "Modify":
          icon = "mdi-cog-transfer";
          break;
        case "Placed":
          icon = "mdi-rocket-launch";
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
