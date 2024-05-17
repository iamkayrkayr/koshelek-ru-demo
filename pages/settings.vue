<template>
  <div>
    <v-btn
        v-if="orderBookStore.isWsConnected"
        @click="orderBookStore.disconnect"
    >
      Disconnect
    </v-btn>
    <v-btn
        v-else
        @click="orderBookStore.connect"
    >
      Connect
    </v-btn>
  </div>
</template>

<script setup>

const orderBookStore = useOrderBookStore();

</script>
