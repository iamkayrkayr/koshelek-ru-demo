<template>
  <div
      class="d-flex flex-row ga-4"
  >
    <OrderTable
        class="flex-1-0"
        :rows="orderBookStore.bids"
    />
    <OrderTable
        class="flex-1-0"
        :rows="orderBookStore.asks"
    />
  </div>
</template>

<script setup>

const orderBookStore = useOrderBookStore();

</script>
