<template>

  <v-footer
      class="flex-0-0"
  >
    <v-container>
      <div class="d-flex flex-row">
        <v-btn
            v-if="orderBookStore.isBusyWsConnecting"
            size="small"
            loading
        />
        <v-btn
            v-else-if="orderBookStore.isWsConnected"
            size="small"
            @click="() => orderBookStore.disconnect()"
        >
          Disconnect WebSocket
        </v-btn>
        <v-btn
            v-else
            size="small"
            @click="() => orderBookStore.connect()"
        >
          Connect WebSocket
        </v-btn>

        <v-btn
            size="small"
            class="ms-2"
            @click="() => orderBookStore.refreshSnapshot()"
        >
          Refresh snapshot
        </v-btn>

        <v-spacer/>

        <a
            class="ml-auto"
            href="https://kayrkayr.com"
            target="_blank"
        >@iamkayrkayr</a>
      </div>

    </v-container>
  </v-footer>
</template>

<script setup>

const orderBookStore = useOrderBookStore();

</script>
