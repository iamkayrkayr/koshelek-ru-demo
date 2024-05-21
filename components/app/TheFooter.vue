<template>

  <v-footer
      class="flex-0-0"
  >
    <v-container>

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
    </v-container>
  </v-footer>
</template>

<script setup>

const orderBookStore = useOrderBookStore();

</script>
