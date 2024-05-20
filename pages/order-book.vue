<template>
  <div
      class="d-flex flex-row ga-4"
  >
    <div
        class="flex-1-1-100"
    >
      <h2 class="mb-4">
        Bid
      </h2>
      <OrderTable
          :rows="orderBookStore.bidsSlice"
          theme="bid"
      />
    </div>
    <div
        class="flex-1-1-100"
    >
      <h2 class="mb-4">
        Ask
      </h2>
      <OrderTable
          :rows="orderBookStore.asksSlice"
          theme="ask"
      />
    </div>
  </div>
</template>

<script setup>

const orderBookStore = useOrderBookStore();

</script>
