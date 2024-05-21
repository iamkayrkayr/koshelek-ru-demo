<template>
  <div class="pt-8">
    <h1
        class="mb-4"
    >Биржевой стакан - {{ orderBookStore.selectedSymbolInfo.title }}</h1>

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
  </div>
</template>

<script setup>

const orderBookStore = useOrderBookStore();

</script>
